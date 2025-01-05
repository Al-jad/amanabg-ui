import { defineStore } from 'pinia';

export const useStationDataMinuteStore = defineStore('stationDataMinute', {
  state: () => ({
    minuteData: null,
    loading: false,
    error: null,
    pagination: {
      skip: 0,
      take: 10,
      total: 0
    }
  }),

  actions: {
    async fetchMinuteData({ stationId, skip = 0, take = 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        
        console.log('Fetching data with:', { stationId, skip, take }); // Debug log

        const response = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            skip,
            take
          }
        });

        this.minuteData = response.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0
        };

        console.log('Response data:', response.data); // Debug log
        console.log('Updated pagination:', this.pagination); // Debug log

      } catch (error) {
        console.error('Error fetching minute data:', error);
        this.error = 'Failed to fetch minute data. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
});
