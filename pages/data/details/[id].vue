<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="dataLoading">
      <!-- Skeleton Loading State -->
      <div class="flex flex-col gap-8">
        <!-- Back Button Skeleton -->
        <div class="h-6 w-32 animate-pulse rounded bg-gray-200"></div>

        <!-- Header Section Skeleton -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between sm:flex-col sm:gap-4">
            <!-- Station Name Skeleton -->
            <div class="h-8 w-64 animate-pulse rounded bg-gray-200"></div>

            <!-- Date Picker Skeleton -->
            <div class="flex items-center gap-4 sm:flex-col">
              <div class="flex gap-2">
                <div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                <div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div class="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          <!-- Duration Buttons Skeleton -->
          <div class="flex gap-2">
            <div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        <!-- Table Skeleton -->
        <div class="rounded-lg bg-white p-4 shadow-lg">
          <div class="flex flex-col gap-4">
            <!-- Table Header Skeleton -->
            <div class="grid grid-cols-8 gap-4">
              <div
                v-for="i in 8"
                :key="`header-${i}`"
                class="h-10 animate-pulse rounded bg-gray-200"
              ></div>
            </div>
            <!-- Table Rows Skeleton -->
            <div
              v-for="row in 5"
              :key="`row-${row}`"
              class="grid grid-cols-8 gap-4"
            >
              <div
                v-for="col in 8"
                :key="`cell-${row}-${col}`"
                class="h-8 animate-pulse rounded bg-gray-200"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chart Skeleton -->
        <div class="h-[400px] w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
    <div
      v-else-if="dataError"
      class="text-center text-red-500"
    >
      <p class="text-lg font-semibold">{{ dataError }}</p>
    </div>
    <div v-else-if="filteredData && filteredData.length > 0">
      <div class="mb-8 flex flex-col items-start gap-4">
        <NuxtLink
          to="/data/pipes-water"
          class="flex items-center text-DarkBlue transition-colors duration-300 hover:text-DarkBlue/80"
        >
          <Icon
            name="mdi:arrow-left"
            class="mr-2"
          />
          Back to All Stations
        </NuxtLink>

        <div
          class="flex w-full flex-col items-start justify-between gap-4 p-6 py-2 sm:p-4 sm:py-1"
        >
          <div
            class="flex w-full items-center justify-between sm:flex-col sm:items-stretch sm:gap-4"
          >
            <h1 class="text-xl font-bold text-gray-800 sm:text-left">
              {{ stationName || 'Station name not found' }}
            </h1>
            <div class="flex items-center gap-2 sm:flex-col sm:gap-4">
              <div class="flex flex-row items-center gap-2">
                <label for="from">From</label>
                <DatePicker
                  v-model="fromDate"
                  dateFormat="dd/mm/yy"
                  class="h-8 sm:h-10"
                  @date-select="handleFromDateChange"
                />
              </div>
              <div class="flex flex-row items-center gap-2">
                <label for="to">To</label>
                <DatePicker
                  v-model="toDate"
                  dateFormat="dd/mm/yy"
                  class="h-8 sm:h-10"
                  @date-select="handleToDateChange"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex gap-2 sm:flex-wrap">
              <Button
                :class="[
                  '!border-none !px-6 !py-2',
                  selectedDuration === 0
                    ? '!bg-DarkBlue !text-white'
                    : '!bg-gray-200 !text-DarkBlue',
                ]"
                label="Minute"
                @click="handleDurationChange(0)"
              />
              <Button
                :class="[
                  '!border-none !px-6 !py-2',
                  selectedDuration === 1
                    ? '!bg-DarkBlue !text-white'
                    : '!bg-gray-200 !text-DarkBlue',
                ]"
                label="Hour"
                @click="handleDurationChange(1)"
              />
              <Button
                :class="[
                  '!border-none !px-6 !py-2',
                  selectedDuration === 2
                    ? '!bg-DarkBlue !text-white'
                    : '!bg-gray-200 !text-DarkBlue',
                ]"
                label="Day"
                @click="handleDurationChange(2)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-lg bg-white p-4 shadow-lg sm:p-4">
        <div class="mb-4">
          <Button
            :label="isExporting ? 'Exporting...' : 'Export to CSV'"
            :disabled="isExporting"
            class="!border-none !bg-DarkBlue !px-4 !py-2 !text-white disabled:!opacity-50"
            @click="exportToCSV"
          />
        </div>
        <Table
          :value="dataLoading ? Array(10).fill({}) : filteredData"
          :columns="columns"
          class="w-full"
          :sortField="'timeStamp'"
          :sortOrder="-1"
          :paginator="selectedDuration === 0 || selectedDuration === 1"
          :rows="10"
          :totalRecords="pagination.total"
          :first="pagination.skip"
          :lazy="true"
          :loading="dataLoading"
          @page="onPageChange"
        >
          <template #loading>
            <tr
              v-for="i in 10"
              :key="i"
            >
              <td
                v-for="col in columns"
                :key="col.field"
                class="p-3"
              >
                <div class="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
            </tr>
          </template>
        </Table>
      </div>
    </div>
    <div
      v-else
      class="text-center"
    >
      <p class="text-base text-gray-600 sm:text-lg">No data available</p>
    </div>
    <div>
      <EChart
        v-if="chartData.length > 0"
        :hourlyData="chartData"
        :includeTDS="true"
        :paramNames="paramNames"
        :units="units"
        v-model:selectedParam="selectedParam"
      />
    </div>
  </div>
</template>
<script setup>
  import Papa from 'papaparse';
  import { useStationDetailsDataStore } from '~/stores/stationDetailsData';
  const route = useRoute();
  const stationDataStore = useStationDetailsDataStore();

  // Date utility functions
  const dateUtils = {
    startOfDay: (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    },

    endOfDay: (date) => {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
    },
  };

  const {
    data: storeData,
    allData: storeAllData,
    loading: dataLoading,
    error: dataError,
    pagination,
    selectedDuration: persistedDuration,
    dateRange: persistedDateRange,
  } = storeToRefs(stationDataStore);

  // Initialize with persisted values
  const fromDate = ref(
    dateUtils.startOfDay(new Date(persistedDateRange.value.fromDate))
  );
  const toDate = ref(
    dateUtils.endOfDay(new Date(persistedDateRange.value.toDate))
  );
  const selectedDuration = ref(persistedDuration.value);

  // Cache key for current request
  const currentRequestKey = computed(() => {
    const stationId = route.params.id;
    return `${stationId}-${selectedDuration.value}-${fromDate.value.getTime()}-${toDate.value.getTime()}`;
  });

  // Track last successful request
  const lastRequestKey = ref('');

  const paramNames = {
    discharge: {
      short: 'Q',
      full: 'Discharge',
    },
    waterLevel: {
      short: 'WL',
      full: 'Water Level',
    },
    pressure: {
      short: 'P',
      full: 'Pressure',
    },
    turbidity: {
      short: 'Turb.',
      full: 'Turbidity',
    },
    cl: {
      short: 'Cl',
      full: 'Chlorine',
    },
    tds: {
      short: 'TDS',
      full: 'Total Dissolved Solids',
    },
    temp: {
      short: 'Temp',
      full: 'Temperature',
    },
  };
  const columns = computed(() => {
    const stationType = parseInt(localStorage.getItem('stationType') || '0');

    const baseColumns = [
      { header: 'DateTime', sortable: true, field: 'dateTime' },
    ];

    const stationColumns = [
      {
        header:
          selectedDuration.value === 0
            ? 'Q'
            : selectedDuration.value === 1
              ? 'Q'
              : 'Q',
        sortable: true,
        field: 'discharge',
        unit:
          selectedDuration.value === 0
            ? 'm³/min'
            : selectedDuration.value === 1
              ? 'm³/h'
              : 'm³/d',
        defaultValue: 0,
      },
    ];

    const tankColumns = [
      {
        header: 'Level',
        sortable: true,
        field: 'waterLevel',
        unit: 'm',
        defaultValue: 0,
      },
      {
        header: 'Volume',
        sortable: true,
        field: 'currentVolume',
        unit: 'm³',
        defaultValue: 0,
      },
    ];

    const waterQualityColumns = [
      {
        header: 'Cl⁺',
        sortable: true,
        field: 'cl',
        unit: 'mg/L',
        defaultValue: 0,
      },
      {
        header: 'Turb',
        sortable: true,
        field: 'turbidity',
        unit: 'NTU',
        defaultValue: 0,
      },
      {
        header: 'TDS',
        sortable: true,
        field: 'tds',
        unit: 'ppm',
        defaultValue: 0,
      },
    ];

    const commonColumns = [
      {
        header: 'Temp',
        sortable: true,
        field: 'temperature',
        unit: 'C',
        defaultValue: 0,
      },
      {
        header: 'P',
        sortable: true,
        field: 'pressure',
        unit: 'm',
        defaultValue: 0,
      },
    ];

    const finalColumns = [
      ...baseColumns,
      ...(stationType === 0 ? stationColumns : []),
      ...(stationType === 1 ? tankColumns : []),
      ...commonColumns,
      ...(stationType === 0 ? waterQualityColumns : []),
    ];

    return finalColumns.map((column) => ({
      ...column,
      class:
        '!bg-DarkBlue !outline !outline-1 !outline-white !text-white font-semibold py-1 sm:py-2',
    }));
  });
  const fetchData = async () => {
    const stationId = parseInt(route.params.id, 10);
    if (isNaN(stationId)) {
      console.error('Invalid station ID');
      return;
    }

    // Format dates as ISO strings for API
    const formattedFromDate = fromDate.value.toISOString();
    const formattedToDate = toDate.value.toISOString();

    await stationDataStore.fetchTableData({
      stationId,
      duration: selectedDuration.value,
      skip: 0,
      take: 10,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    });
  };
  const handleFromDateChange = (event) => {
    const date = event instanceof Date ? event : new Date(event);
    const newDate = dateUtils.startOfDay(date);
    if (newDate.getTime() === fromDate.value.getTime()) return; // Prevent unnecessary updates
    fromDate.value = newDate;
    stationDataStore.setDateRange(fromDate.value, toDate.value);
    fetchData();
  };
  const handleToDateChange = (event) => {
    const date = event instanceof Date ? event : new Date(event);
    const newDate = dateUtils.endOfDay(date);
    if (newDate.getTime() === toDate.value.getTime()) return; // Prevent unnecessary updates
    toDate.value = newDate;
    stationDataStore.setDateRange(fromDate.value, toDate.value);
    fetchData();
  };
  const units = {
    q: 'm³/min',
    pressure: 'Bar',
    turbidity: 'NTU',
    cl: 'mg/L',
    tds: 'ppm',
    temp: 'C',
    waterLevel: 'm',
  };
  const filteredData = computed(() => {
    const data = storeData.value?.data || [];

    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      ...item,
      dateTime: `${new Date(item.date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}\n${new Date(item.date).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`,
      timeStamp: new Date(item.date),
      discharge: item.discharge
        ? Number(item.discharge).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '-',
      pressure: item.pressure
        ? Number(item.pressure).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '-',
      temperature: item.temperature
        ? Number(item.temperature).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
      cl: item.cl
        ? Number(item.cl).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
      turbidity: item.turbidity
        ? Number(item.turbidity).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
      tds: item.electricConductivity
        ? (item.electricConductivity * 0.65).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
      waterLevel: item.waterLevel
        ? Number(item.waterLevel).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
      currentVolume: item.currentVolume
        ? Number(item.currentVolume).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
    }));
  });
  const stationName = ref('N/A');
  const stationCity = ref('N/A');
  onMounted(() => {
    if (process.client) {
      stationName.value = window.localStorage.getItem('stationName') || 'N/A';
      stationCity.value = window.localStorage.getItem('stationCity') || 'N/A';

      // Only fetch if we don't have cached data
      const stationId = parseInt(route.params.id, 10);
      if (
        !stationDataStore.getCachedData(
          stationId,
          selectedDuration.value,
          fromDate.value,
          toDate.value
        )
      ) {
        fetchData();
      }
    }
  });

  const selectedParam = ref('discharge');
  const handleDurationChange = async (duration) => {
    if (duration === selectedDuration.value) return; // Prevent unnecessary updates
    selectedDuration.value = duration;
    stationDataStore.setSelectedDuration(duration);
    await fetchData();
  };
  const onPageChange = async (event) => {
    const stationId = parseInt(route.params.id, 10);
    if (isNaN(stationId)) return;

    // Only fetch table data for pagination
    await stationDataStore.fetchTableData({
      stationId,
      duration: selectedDuration.value,
      skip: event.first,
      take: event.rows,
      fromDate: fromDate.value,
      toDate: toDate.value,
    });
  };
  const chartData = computed(() => {
    if (!storeAllData.value?.data || !Array.isArray(storeAllData.value.data))
      return [];

    return storeAllData.value.data.map((item) => ({
      ...item,
      timeStamp: new Date(item.date),
      tds: item.electricConductivity
        ? (item.electricConductivity * 0.65).toFixed(2)
        : 0,
      q: item.discharge || 0,
      pressure: item.pressure || 0,
      temp: item.temperature || 0,
      waterLevel: item.waterLevel || 0,
    }));
  });
  const isExporting = ref(false);

  const formatDateTime = (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) throw new Error('Invalid date');
      return {
        date: d.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        time: d.toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'Invalid Date', time: 'Invalid Time' };
    }
  };

  const exportToCSV = async () => {
    if (isExporting.value) return;
    isExporting.value = true;

    try {
      const data = storeAllData.value?.data;
      if (!data || data.length === 0) return;

      // Process the complete dataset with the same transformations as filteredData
      const processedData = data.map((item) => {
        const dateTime = formatDateTime(item.date);
        return {
          dateTime: `${dateTime.date}\n${dateTime.time}`,
          discharge: item.discharge
            ? Number(item.discharge).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          pressure: item.pressure
            ? Number(item.pressure).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          temperature: item.temperature
            ? Number(item.temperature).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          cl: item.cl
            ? Number(item.cl).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          turbidity: item.turbidity
            ? Number(item.turbidity).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          tds: item.electricConductivity
            ? (item.electricConductivity * 0.65).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          waterLevel: item.waterLevel
            ? Number(item.waterLevel).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          currentVolume: item.currentVolume
            ? Number(item.currentVolume).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
        };
      });

      // Convert to CSV format using the processed data
      const csv = Papa.unparse({
        fields: columns.value.map((col) => col.header),
        data: processedData.map((row) =>
          columns.value.map((col) => row[col.field])
        ),
      });

      // Create blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${stationName.value.replace(/[^a-zA-Z0-9-_]/g, '_')}_${new Date(fromDate.value).toISOString().split('T')[0]}_to_${new Date(toDate.value).toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } finally {
      isExporting.value = false;
    }
  };
</script>
<style>
  .p-datepicker-input {
    @apply !bg-gray-200 text-sm !text-black sm:text-base;
  }
  .p-select-list {
    @apply !bg-white !text-black;
  }
  .p-datatable .p-datatable-tbody > tr > td {
    white-space: pre-line;
  }
  .p-select {
    @apply !border !border-DarkBlue !bg-gray-100 !text-black;
  }
  .p-select-option {
    @apply !border !border-DarkBlue !bg-gray-100 !text-black;
  }
  .p-select-option-selected {
    @apply !bg-DarkBlue !text-white;
  }
  .p-select-label {
    @apply !text-black;
  }
  .p-select .p-component .p-inputwrapper {
    @apply !bg-gray-100;
  }
</style>
