import { defineStore } from 'pinia';

export const useStationDetailsStore = defineStore('stationDetails', {
  state: () => ({
    stationDetails: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStationDetails(stationId) {
      this.loading = true;
      this.error = null;

      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`/Pipes/Station/${stationId}`);
        this.stationDetails = response.data;
      } catch (error) {
        console.error('Error fetching station details:', error);
        this.error = 'Failed to fetch station details. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getStationDetails: (state) => state.stationDetails,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
