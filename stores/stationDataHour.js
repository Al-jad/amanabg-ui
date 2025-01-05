import { defineStore } from 'pinia';

export const useStationDataHourStore = defineStore('stationDataHour', {
  state: () => ({
    hourlyData: null,
    allHourlyData: null, // For chart data
    loading: false,
    error: null,
    pagination: {
      skip: 0,
      take: 10,
      total: 0
    }
  }),

  actions: {
    async fetchHourlyData({ stationId, fromDate, toDate, skip = 0, take = 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        
        // Fetch paginated data for table
        const response = await $axios.get(`/Pipes/hourly`, {
          params: {
            stationId,
            fromDate,
            toDate,
            skip,
            take
          }
        });

        // Fetch all data for chart
        const allDataResponse = await $axios.get(`/Pipes/hourly`, {
          params: {
            stationId,
            fromDate,
            toDate,
            skip: 0,
            take: 999999 // Large number to get all data
          }
        });

        this.hourlyData = response.data;
        this.allHourlyData = allDataResponse.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0
        };
        
      } catch (error) {
        console.error('Error fetching hourly data:', error);
        this.error = 'Failed to fetch hourly data. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    // Helper method to update pagination
    updatePagination(skip, take) {
      this.pagination.skip = skip;
      this.pagination.take = take;
    }
  },

  getters: {
    // Add getters for convenience
    getPaginatedData: (state) => state.hourlyData?.data || [],
    getAllData: (state) => state.allHourlyData?.data || [],
    getPagination: (state) => state.pagination,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});
