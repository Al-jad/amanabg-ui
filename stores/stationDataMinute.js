import { defineStore } from 'pinia';

export const useStationDataMinuteStore = defineStore('stationDataMinute', {
  state: () => ({
    minuteData: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMinuteData({ stationId, date }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        
        // Format the date as M-D-YYYY
        const formattedDate = new Date(date).toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }).replace(/\//g, '-');

        const response = await $axios.get(`/Pipes/realtime?stationId=${stationId}`);
        this.minuteData = response.data;
      } catch (error) {
        console.error('Error fetching minute data:', error);
        this.error = 'Failed to fetch minute data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
});
