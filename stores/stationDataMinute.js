import { defineStore } from 'pinia';

export const useStationDataMinuteStore = defineStore('stationDataMinute', {
  state: () => ({
    minuteData: null,
    allMinuteData: null,
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
        const response = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            skip,
            take
          }
        });

        const allDataResponse = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            skip: 0,
            take: 1000
          }
        });

        this.minuteData = response.data;
        this.allMinuteData = allDataResponse.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0
        };

      } catch (error) {
        console.error('Error fetching minute data:', error);
        this.error = 'Failed to fetch minute data. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
});
