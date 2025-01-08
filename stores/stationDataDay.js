import { defineStore } from 'pinia';

export const useStationDataDayStore = defineStore('stationDataDay', {
  state: () => ({
    dailyData: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDailyData({ startDate, endDate }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        const formatDate = (date) => new Date(date).toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }).replace(/\//g, '-');

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const response = await $axios.get(`/Pipes/daily_discharge?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        this.dailyData = response.data;
      } catch (error) {
        console.error('Error fetching daily data:', error);
        this.error = 'Failed to fetch daily data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
});