import { defineStore } from 'pinia';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';

export const useStationStore = defineStore('station', {
  state: () => ({
    stationData: null,
    pipesData: null,
    error: '',
    isConnecting: false,
    connectionLogs: [],
    connection: null,
  }),

  actions: {
    async connect() {
      this.isConnecting = true;
      this.error = '';
      this.connectionLogs = [];

      try {
        this.connection = new HubConnectionBuilder()
          .withUrl("https://amanaapi.alfakharco.com/datahub", {
            transport: HttpTransportType.WebSockets
          })
          .configureLogging(LogLevel.Debug)
          .build();

        this.connection.onclose(() => {
          this.connectionLogs.push('Connection closed');
        });

        this.connection.on('ReceiveStationData', (station, latestPipesData) => {
          if (!station || !latestPipesData) {
            console.error('Received invalid data:', station, latestPipesData);
            this.connectionLogs.push('Received invalid data');
            return;
          }
          this.stationData = station;
          this.pipesData = latestPipesData,station;
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

    // Add this method to set pipes data
    setPipesData(data) {
      this.pipesData = data;
    },
  },
});

// You might want to call this in your component or App.vue
// import { useStationStore } from './stores/stationData';
// import { onMounted } from 'vue';
// 
// export default {
//   setup() {
//     const stationStore = useStationStore();
//
//     onMounted(() => {
//       stationStore.connect();
//     });
//
//     return { stationStore };
//   }
// };