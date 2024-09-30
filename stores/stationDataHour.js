import { defineStore } from 'pinia';

export const useStationDataHourStore = defineStore('stationDataHour', {
  state: () => ({
    hourlyData: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchHourlyData({ stationId }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`/Pipes/hourly?stationID=${stationId}`);
        this.hourlyData = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching hourly data:', error);
        this.error = 'Failed to fetch hourly data. Please try again.';
      } finally {
        
      }
    },
  },
});
