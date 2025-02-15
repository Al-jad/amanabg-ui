import { defineStore } from 'pinia';

export const useStationDetailsDataStore = defineStore('stationDetailsData', {
  state: () => ({
    data: null, // Paginated data
    fullData: null, // Full data for chart
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
      'fullData',
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

      // Rehydrate data dates if they exist
      if (ctx.store.data?.data) {
        ctx.store.data.data = ctx.store.data.data.map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
      }
      if (ctx.store.fullData?.data) {
        ctx.store.fullData.data = ctx.store.fullData.data.map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
      }
    },
  },

  actions: {
    getCacheKey(stationId, duration, fromDate, toDate, isPaginated = true) {
      return `${stationId}-${duration}-${new Date(fromDate).getTime()}-${new Date(toDate).getTime()}-${isPaginated ? 'page' : 'full'}`;
    },

    getCachedData(stationId, duration, fromDate, toDate, isPaginated = true) {
      const cacheKey = this.getCacheKey(
        stationId,
        duration,
        fromDate,
        toDate,
        isPaginated
      );
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

    setCachedData(
      stationId,
      duration,
      fromDate,
      toDate,
      data,
      isPaginated = true
    ) {
      const cacheKey = this.getCacheKey(
        stationId,
        duration,
        fromDate,
        toDate,
        isPaginated
      );
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
      this.loading = true;
      this.error = null;

      try {
        // Fetch paginated data
        const response = await useNuxtApp().$axios.get(`/Pipes/realtime`, {
          params: {
            stationId,
            byDuration: duration,
            skip,
            take,
            fromDate,
            toDate,
          },
        });

        this.data = response.data;
        this.pagination = {
          skip,
          take,
          total: response.data.count || 0,
        };

        // Cache paginated response
        this.setCachedData(
          stationId,
          duration,
          fromDate,
          toDate,
          {
            tableData: response.data,
            pagination: this.pagination,
          },
          true
        );

        // If this is the first page, also fetch full data for the chart
        if (skip === 0) {
          const fullDataResponse = await useNuxtApp().$axios.get(
            `/Pipes/realtime`,
            {
              params: {
                stationId,
                byDuration: duration,
                skip: 0,
                take: 36000, // Get all data for the chart
                fromDate,
                toDate,
              },
            }
          );

          this.fullData = fullDataResponse.data;

          // Cache full data response
          this.setCachedData(
            stationId,
            duration,
            fromDate,
            toDate,
            {
              fullData: fullDataResponse.data,
            },
            false
          );
        }
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
