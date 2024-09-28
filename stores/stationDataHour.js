import { defineStore } from 'pinia';

export const useStationDataHourStore = defineStore('stationDataHour', {
  state: () => ({
    hourlyData: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchHourlyData() {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get('/Pipes/hourly');
        this.hourlyData = response.data;
      } catch (error) {
        console.error('Error fetching hourly data:', error);
        this.error = 'Failed to fetch hourly data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getHourlyData: (state) => state.hourlyData,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
