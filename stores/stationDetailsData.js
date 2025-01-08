import { defineStore } from 'pinia';

export const useStationDetailsDataStore = defineStore('stationDetailsData', {
  state: () => ({
    data: null,
    allData: null,
    loading: false,
    error: null,
    pagination: {
      skip: 0,
      take: 10,
      total: 0
    }
  }),

  actions: {
    async fetchTableData({ stationId, duration, skip, take, fromDate, toDate }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            byDuration: duration,
            skip: skip,
            take: take,
            fromDate,
            toDate
          }
        });

        const allDataResponse = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            byDuration: duration,
            skip: 0,
            take: 36000,
            fromDate,
            toDate
          }
        });

        this.data = response.data;
        this.allData = allDataResponse.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0
        };

      } catch (error) {
        console.error('Error fetching data:', error);
        this.error = 'Failed to fetch data. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  }
});
