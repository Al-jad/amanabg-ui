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
      total: 0,
    },
    selectedDuration: 1,
    dateRange: {
      fromDate: new Date(new Date().setDate(new Date().getDate() - 14)),
      toDate: new Date(),
    },
    cachedData: {}, // Store for caching requests
  }),

  persist: {
    paths: [
      'selectedDuration',
      'dateRange',
      'cachedData',
      'data',
      'allData',
      'pagination',
    ],
    afterRestore: (ctx) => {
      // Rehydrate dates after restore
      if (ctx.store.dateRange) {
        ctx.store.dateRange.fromDate = new Date(ctx.store.dateRange.fromDate);
        ctx.store.dateRange.toDate = new Date(ctx.store.dateRange.toDate);
      }

      // Rehydrate cached data timestamps
      if (ctx.store.cachedData) {
        Object.keys(ctx.store.cachedData).forEach((key) => {
          if (ctx.store.cachedData[key]) {
            ctx.store.cachedData[key].timestamp = new Date(
              ctx.store.cachedData[key].timestamp
            ).getTime();
          }
        });
      }
    },
  },

  actions: {
    getCacheKey(stationId, duration, fromDate, toDate) {
      return `${stationId}-${duration}-${new Date(fromDate).getTime()}-${new Date(toDate).getTime()}`;
    },

    getCachedData(stationId, duration, fromDate, toDate) {
      const cacheKey = this.getCacheKey(stationId, duration, fromDate, toDate);
      const cachedItem = this.cachedData[cacheKey];

      if (!cachedItem) return null;

      // Check if cache is still valid (15 minutes for real-time data)
      const now = new Date().getTime();
      if (now - cachedItem.timestamp > 15 * 60 * 1000) {
        delete this.cachedData[cacheKey];
        return null;
      }

      return cachedItem.data;
    },

    setCachedData(stationId, duration, fromDate, toDate, data) {
      const cacheKey = this.getCacheKey(stationId, duration, fromDate, toDate);
      this.cachedData[cacheKey] = {
        data,
        timestamp: new Date().getTime(),
      };
    },

    async fetchTableData({
      stationId,
      duration,
      skip,
      take,
      fromDate,
      toDate,
    }) {
      // Check cache first
      const cachedData = this.getCachedData(
        stationId,
        duration,
        fromDate,
        toDate
      );
      if (cachedData) {
        console.log('Using cached data');
        this.data = cachedData.tableData;
        this.allData = cachedData.allData;
        this.pagination = cachedData.pagination;
        return;
      }

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
            toDate,
          },
        });

        const allDataResponse = await $axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            byDuration: duration,
            skip: 0,
            take: 36000,
            fromDate,
            toDate,
          },
        });

        this.data = response.data;
        this.allData = allDataResponse.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0,
        };

        // Cache the response
        this.setCachedData(stationId, duration, fromDate, toDate, {
          tableData: response.data,
          allData: allDataResponse.data,
          pagination: this.pagination,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        this.error = 'Failed to fetch data. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    setSelectedDuration(duration) {
      this.selectedDuration = duration;
    },

    setDateRange(fromDate, toDate) {
      this.dateRange = { fromDate, toDate };
    },
  },
});
