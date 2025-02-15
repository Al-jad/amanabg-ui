import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';
import { defineStore } from 'pinia';

export const useStationStore = defineStore('station', {
  state: () => ({
    stationData: null,
    pipesData: [],
    error: '',
    isConnecting: false,
    connectionLogs: [],
    connection: null,
    lastUpdate: null,
  }),

  persist: {
    paths: ['pipesData', 'lastUpdate'],
    afterRestore: (ctx) => {
      // Rehydrate lastUpdate timestamp
      if (ctx.store.lastUpdate) {
        ctx.store.lastUpdate = new Date(ctx.store.lastUpdate).getTime();
      }
    },
  },

  actions: {
    async connect() {
      this.isConnecting = true;
      this.error = '';
      this.connectionLogs = [];

      try {
        this.connection = new HubConnectionBuilder()
          .withUrl('https://amanaapi.alfakharco.com/datahub', {
            transport: HttpTransportType.WebSockets,
          })
          .build();

        this.connection.onclose(() => {
          this.connectionLogs.push('Connection closed');
        });

        this.connection.on('ReceiveStationData', (station, latestPipesData) => {
          // Only update if data is newer than what we have
          if (
            !this.lastUpdate ||
            new Date(latestPipesData[0]?.timeStamp).getTime() > this.lastUpdate
          ) {
            this.stationData = station;
            this.pipesData = latestPipesData;
            this.lastUpdate = new Date().getTime();
          }
        });

        await this.connection.start();
        this.connectionLogs.push('Connected to SignalR hub');
      } catch (err) {
        console.error('Error connecting to SignalR hub:', err);
        this.error = 'An error occurred. Please try again.';
        this.connectionLogs.push(`Error: ${err.message}`);
      } finally {
        this.isConnecting = false;
      }
    },

    setPipesData(data) {
      // Only update if data is newer than what we have
      const newDataTimestamp = Array.isArray(data)
        ? data[0]?.timeStamp
        : data?.timeStamp;
      if (
        !this.lastUpdate ||
        (newDataTimestamp &&
          new Date(newDataTimestamp).getTime() > this.lastUpdate)
      ) {
        this.pipesData = Array.isArray(data) ? data : [data];
        this.lastUpdate = new Date().getTime();
      }
    },

    shouldRefreshData() {
      if (!this.lastUpdate) return true;

      // Refresh if data is older than 1 minute
      const now = new Date().getTime();
      return now - this.lastUpdate > 60 * 1000;
    },
  },
});
