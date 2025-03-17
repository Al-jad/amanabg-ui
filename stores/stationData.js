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
    isConnected: false,
  }),

  persist: {
    paths: ['pipesData', 'lastUpdate'],
    afterRestore: (ctx) => {
      if (ctx.store.lastUpdate) {
        ctx.store.lastUpdate = new Date(ctx.store.lastUpdate).getTime();
      }
    },
  },

  actions: {
    async connect() {
      if (this.isConnected || this.isConnecting) {
        return;
      }

      this.isConnecting = true;
      this.error = '';
      this.connectionLogs = [];

      try {
        if (this.connection) {
          await this.connection.stop();
        }

        this.connection = new HubConnectionBuilder()
          .withUrl('https://amanaapi.alfakharco.com/datahub', {
            transport: HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000])
          .build();

        this.connection.on('ReceiveStationData', (station) => {
          this.handleNewData(station);
        });

        this.connection.on('ReceiveLatestData', (data) => {
          this.handleNewData(data);
        });

        this.connection.on('ReceiveData', (data) => {
          this.handleNewData(data);
        });

        this.connection.on('UpdateData', (data) => {
          this.handleNewData(data);
        });

        this.connection.onclose(() => {
          this.connectionLogs.push('Connection closed');
          this.isConnected = false;
        });

        this.connection.onreconnecting(() => {
          this.connectionLogs.push('Reconnecting...');
          this.isConnected = false;
        });

        this.connection.onreconnected(() => {
          this.connectionLogs.push('Reconnected');
          this.isConnected = true;
        });

        await this.connection.start();
        this.connectionLogs.push('Connected to SignalR hub');
        this.isConnected = true;
      } catch (err) {
        this.error = 'An error occurred. Please try again.';
        this.connectionLogs.push(`Error: ${err.message}`);
        this.isConnected = false;
      } finally {
        this.isConnecting = false;
      }
    },

    handleNewData(data) {
      if (data && Array.isArray(data)) {
        const validData = data.filter((item) => item && item.stationId);
        if (validData.length > 0) {
          this.pipesData = validData;
          this.lastUpdate = new Date().getTime();
          this.connectionLogs.push('Data updated');
        }
      }
    },

    setPipesData(data) {
      if (data && Array.isArray(data) && data.length > 0) {
        const validData = data.filter((item) => item && item.stationId);
        if (validData.length > 0) {
          this.pipesData = validData;
          this.lastUpdate = new Date().getTime();
          this.connectionLogs.push('Pipes data updated via setPipesData');
        } else {
          this.pipesData = [];
        }
      } else {
        this.pipesData = [];
      }
    },

    shouldRefreshData() {
      if (!this.lastUpdate) return true;
      const now = new Date().getTime();
      return now - this.lastUpdate > 60 * 1000;
    },
  },
});
