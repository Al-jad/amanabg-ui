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
    <div v-else>
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
          class="flex w-full flex-col items-start justify-between gap-1 p-6 py-2 sm:p-4 sm:py-1"
        >
          <div
            class="flex w-full items-center justify-between sm:flex-col sm:items-stretch sm:gap-4"
          >
            <h1 class="text-xl font-bold text-gray-800 sm:text-left">
              {{ stationName || 'Station name not found' }}
            </h1>
            <!-- Desktop Date Picker (shows above sm:639px) -->
            <div class="flex items-center rounded-lg p-4 sm:hidden">
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <label
                    class="whitespace-nowrap text-sm font-medium text-gray-700"
                  >
                    From:
                  </label>
                  <DatePicker
                    v-model="fromDate"
                    dateFormat="dd/mm/yy"
                    class="h-8"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <label
                    class="whitespace-nowrap text-sm font-medium text-gray-700"
                  >
                    To:
                  </label>
                  <DatePicker
                    v-model="toDate"
                    dateFormat="dd/mm/yy"
                    class="h-8"
                  />
                </div>
                <Button
                  class="!h-8 !border-none !bg-DarkBlue !px-6 !text-white disabled:!opacity-50"
                  @click="handleOK"
                >
                  <p>Submit</p>
                  <Icon
                    name="formkit:submit"
                    class=""
                  />
                </Button>
              </div>
            </div>

            <!-- Mobile Date Picker (shows below sm:639px) -->
            <div
              class="hidden rounded-lg border border-gray-300 bg-gray-100 p-2 sm:block"
            >
              <div class="flex flex-col items-start justify-start gap-2">
                <p class="text-left text-sm text-gray-600">Select Dates:</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="grid grid-flow-row-dense grid-cols-2 gap-2 p-2">
                  <div class="flex max-w-[30%] flex-col gap-6">
                    <label for="from">From</label>
                    <label for="to">To</label>
                  </div>
                  <div class="flex min-w-[70%] flex-col items-center gap-2">
                    <DatePicker
                      v-model="fromDate"
                      dateFormat="dd/mm/yy"
                      class="h-8"
                    />
                    <DatePicker
                      v-model="toDate"
                      dateFormat="dd/mm/yy"
                      class="h-8"
                    />
                  </div>
                  <div class="col-span-2 flex w-full justify-end">
                    <Button
                      class="!h-10 !w-[50%] !border-none !bg-DarkBlue !px-6 !py-2 !text-white disabled:!opacity-50"
                      @click="handleOK"
                    >
                      <p>Submit</p>
                      <Icon
                        name="formkit:submit"
                        class=""
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="isMobile"
            class="flex items-center gap-4"
          >
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
          <div class="mt-4 flex flex-col gap-2 py-4">
            <div class="flex flex-col">
              <p class="text-left text-sm text-gray-600">Select Timeframe:</p>
            </div>
            <div class="flex w-full items-center gap-2 sm:flex-wrap">
              <Button
                :class="[
                  '!border-none !px-8 !py-2',
                  selectedDuration === 0
                    ? '!bg-DarkBlue !text-white'
                    : '!bg-gray-200 !text-DarkBlue',
                ]"
                label="Minute"
                @click="handleDurationChange(0)"
              />
              <Button
                :class="[
                  '!border-none !px-10 !py-2',
                  selectedDuration === 1
                    ? '!bg-DarkBlue !text-white'
                    : '!bg-gray-200 !text-DarkBlue',
                ]"
                label="Hour"
                @click="handleDurationChange(1)"
              />
              <Button
                :class="[
                  '!border-none !px-10 !py-2',
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

      <!-- Table Section -->
      <div class="rounded-lg bg-white p-4 shadow-lg sm:p-4">
        <div v-if="filteredData && filteredData.length > 0">
          <Table
            :value="filteredData"
            :columns="columns"
            class="w-full"
            :sortField="'timeStamp'"
            :sortOrder="-1"
            :paginator="true"
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
          <div class="mt-4 flex justify-end gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Sort Order:</label>
              <div class="flex flex-row gap-4 rounded-lg bg-gray-100">
                <Button
                  :class="[
                    '!border !border-DarkBlue !px-4 !py-2',
                    exportSortOrder === 'asc'
                      ? '!bg-DarkBlue !text-white'
                      : '!bg-gray-100 !text-DarkBlue',
                  ]"
                  @click="exportSortOrder = 'asc'"
                >
                  <Icon
                    name="mdi:sort-ascending"
                    class="text-lg"
                  />
                  <span class="ml-1">Ascending</span>
                </Button>
                <Button
                  :class="[
                    '!border !border-DarkBlue !px-4 !py-2',
                    exportSortOrder === 'desc'
                      ? '!bg-DarkBlue !text-white'
                      : '!bg-gray-100 !text-DarkBlue',
                  ]"
                  @click="exportSortOrder = 'desc'"
                >
                  <Icon
                    name="mdi:sort-descending"
                    class="text-lg"
                  />
                  <span class="ml-1">Descending</span>
                </Button>
              </div>
            </div>
            <Button
              :disabled="isExporting"
              class="!h-10 !border-none !bg-emerald-800 !px-4 !py-4 !text-white disabled:!opacity-50"
              @click="exportToCSV"
            >
              <Icon
                name="mdi:file-excel"
                class="mr-2 text-lg"
              />
              <p>{{ isExporting ? 'Saving...' : 'Save as Excel' }}</p>
            </Button>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center p-8"
        >
          <div class="text-center">
            <Icon
              name="mdi:database-off"
              class="mb-3 text-4xl text-gray-400"
            />
            <p class="text-gray-600">
              No data available for the selected period
            </p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="mt-4">
        <div v-if="chartData.length > 0">
          <EChart
            :hourlyData="chartData"
            :includeTDS="stationType === 0"
            :paramNames="paramNames"
            :units="units"
            :availableParams="availableParams"
            v-model:selectedParam="selectedParam"
          />
        </div>
        <div
          v-else
          class="mt-8 rounded-lg bg-white p-8 shadow-lg"
        >
          <div class="text-center">
            <Icon
              name="mdi:chart-line-off"
              class="mb-3 text-4xl text-gray-400"
            />
            <p class="text-gray-600">
              No chart data available for the selected period
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import Papa from 'papaparse';
  import { useStationDetailsDataStore } from '~/stores/stationDetailsData';
  const route = useRoute();
  const stationDataStore = useStationDetailsDataStore();
  const isMobile = ref(false);
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
    fullData: storeFullData,
    loading: dataLoading,
    error: dataError,
    pagination,
    selectedDuration: persistedDuration,
    dateRange: persistedDateRange,
  } = storeToRefs(stationDataStore);

  // Initialize with persisted values
  const fromDate = ref(new Date(persistedDateRange.value.fromDate));
  fromDate.value.setHours(0, 0, 0, 0);

  const toDate = ref(new Date(persistedDateRange.value.toDate));
  toDate.value.setHours(23, 59, 59, 999);
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
    waterLevelPercentage: {
      short: 'WL%',
      full: 'Water Level Percentage',
    },
    totalVolume: {
      short: 'Vol.',
      full: 'Total Volume',
    },
    temp: {
      short: 'Temp',
      full: 'Temperature',
    },
    pressure: {
      short: 'P',
      full: 'Pressure',
    },
  };
  const tankColumns = [
    {
      header: 'WL (m)',
      sortable: true,
      field: 'waterLevel',
      unit: 'm',
      defaultValue: 0,
    },
    {
      header: 'WL %',
      sortable: true,
      field: 'waterLevelPercentage',
      unit: '%',
      defaultValue: 0,
      body: (rowData) => {
        const wl = Number(rowData.waterLevel) || 0;
        return `${((wl / 6) * 100).toFixed(2)}%`;
      },
    },
    {
      header: 'Total Vol.',
      sortable: true,
      field: 'totalVolume',
      unit: 'm³',
      defaultValue: 0,
      body: (rowData) => {
        const wl = Number(rowData.waterLevel) || 0;
        return (wl * 170 * 250).toFixed(2);
      },
    },
  ];
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
        header: 'P',
        sortable: true,
        field: 'pressure',
        unit: 'm',
        defaultValue: 0,
      },
      {
        header: 'Temp',
        sortable: true,
        field: 'temperature',
        unit: 'C',
        defaultValue: 0,
      },
    ];

    const finalColumns = [
      ...baseColumns,
      ...(stationType === 1 ? tankColumns : stationColumns),
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

    // Set the exact times for start and end dates
    const startDateTime = dateUtils.startOfDay(fromDate.value);
    const endDateTime = dateUtils.endOfDay(toDate.value);

    // Reset store data before fetching new data
    stationDataStore.data = null;
    stationDataStore.fullData = null;

    await stationDataStore.fetchTableData({
      stationId,
      duration: selectedDuration.value,
      skip: stationDataStore.pagination.skip,
      take: stationDataStore.pagination.take,
      fromDate: startDateTime.toISOString(),
      toDate: endDateTime.toISOString(),
    });

    // Update the last request key to track successful requests
    lastRequestKey.value = currentRequestKey.value;
  };
  const handleFromDateChange = (event) => {
    const date = event instanceof Date ? event : new Date(event);
    date.setHours(0, 0, 0, 0);
    if (date.getTime() === fromDate.value.getTime()) return;
    fromDate.value = date;
    stationDataStore.setDateRange(fromDate.value, toDate.value);
    fetchData();
  };
  const handleToDateChange = (event) => {
    const date = event instanceof Date ? event : new Date(event);
    date.setHours(23, 59, 59, 999);
    if (date.getTime() === toDate.value.getTime()) return;
    toDate.value = date;
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
    waterLevelPercentage: '%',
    totalVolume: 'm³',
  };
  const stationType = ref(0);
  const filteredData = computed(() => {
    const data = storeData.value?.data || [];
    const stationType = parseInt(localStorage.getItem('stationType') || '0');

    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const baseData = {
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
        temperature: item.temperature
          ? Number(item.temperature).toLocaleString('en-US', {
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
      };

      if (stationType === 1) {
        // Tank calculations
        const waterLevel = Number(item.waterLevel) || 0;
        const waterLevelPercentage = ((waterLevel / 6) * 100).toFixed(2);
        const totalVolume = (waterLevel * 170 * 250).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return {
          ...baseData,
          waterLevel: waterLevel.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          waterLevelPercentage: `${waterLevelPercentage}%`,
          totalVolume: totalVolume,
        };
      } else {
        // Pipe station data
        return {
          ...baseData,
          discharge: item.discharge
            ? Number(item.discharge).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          cl: item.cl
            ? Number(item.cl).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          turbidity: item.turbidity
            ? Number(item.turbidity).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          tds: item.electricConductivity
            ? (item.electricConductivity * 0.65).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
        };
      }
    });
  });

  const handleOK = async () => {
    // Reset pagination when changing dates
    stationDataStore.pagination.skip = 0;

    // Update store date range first
    stationDataStore.setDateRange(fromDate.value, toDate.value);

    // Force a fresh data fetch
    await fetchData();

    // Clear any cached data for the new date range
    stationDataStore.cachedData = {};
  };

  const stationName = ref('N/A');
  const stationCity = ref('N/A');
  const selectedParam = ref('discharge');

  watch(
    stationType,
    (newType) => {
      selectedParam.value = newType === 1 ? 'waterLevel' : 'discharge';
    },
    { immediate: true }
  );
  watch(
    () => window.innerWidth,
    (newWidth) => {
      isMobile.value = newWidth < 768;
    }
  );

  const availableParams = computed(() => {
    if (stationType.value === 1) {
      return [
        'waterLevel',
        'waterLevelPercentage',
        'totalVolume',
        'temperature',
        'pressure',
      ];
    }

    return ['discharge', 'pressure', 'temperature', 'cl', 'turbidity', 'tds'];
  });

  const handleDurationChange = async (duration) => {
    if (duration === selectedDuration.value) return; // Prevent unnecessary updates

    // Reset pagination and store data
    stationDataStore.pagination.skip = 0;
    stationDataStore.data = null;
    stationDataStore.fullData = null;

    // Clear cached data when switching durations
    stationDataStore.cachedData = {};

    selectedDuration.value = duration;
    stationDataStore.setSelectedDuration(duration);

    // Force immediate data fetch
    await fetchData();
  };
  const onPageChange = async (event) => {
    const stationId = parseInt(route.params.id, 10);
    if (isNaN(stationId)) return;

    // Set the exact times for start and end dates
    const startDateTime = dateUtils.startOfDay(fromDate.value);
    const endDateTime = dateUtils.endOfDay(toDate.value);

    // Update pagination in store
    stationDataStore.pagination.skip = event.first;

    // Fetch table data with pagination
    await stationDataStore.fetchTableData({
      stationId,
      duration: selectedDuration.value,
      skip: event.first,
      take: event.rows,
      fromDate: startDateTime.toISOString(),
      toDate: endDateTime.toISOString(),
    });
  };
  const chartData = computed(() => {
    const data = storeFullData.value?.data || [];
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const baseData = {
        timeStamp: new Date(item.date),
        pressure: item.pressure
          ? Number(item.pressure).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        temp: item.temperature
          ? Number(item.temperature).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
      };

      if (stationType.value === 1) {
        // Tank-specific data
        const waterLevel = Number(item.waterLevel || 0);
        const waterLevelFormatted = waterLevel.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const waterLevelPercentage = ((waterLevel / 6) * 100).toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        const totalVolume = (waterLevel * 170 * 250).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return {
          ...baseData,
          waterLevel: waterLevelFormatted,
          waterLevelPercentage: waterLevelPercentage,
          totalVolume: totalVolume,
          temp: item.temperature
            ? Number(item.temperature).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
        };
      } else {
        // Pipe station data
        return {
          ...baseData,
          discharge: item.discharge
            ? Number(item.discharge).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00',
          tds: item.electricConductivity
            ? (item.electricConductivity * 0.65).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          turbidity: item.turbidity
            ? Number(item.turbidity).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          cl: item.cl
            ? Number(item.cl).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
        };
      }
    });
  });
  const isExporting = ref(false);
  const exportSortOrder = ref('asc');

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
      const data = storeFullData.value?.data;
      if (!data || data.length === 0) return;

      // Process the complete dataset with the same transformations as filteredData
      let processedData = data.map((item) => {
        const date = new Date(item.date);
        const formattedDateTime = date.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return {
          dateTime: formattedDateTime,
          date: date, // Add raw date for sorting
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
            : '-',
          cl: item.cl
            ? Number(item.cl).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          turbidity: item.turbidity
            ? Number(item.turbidity).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          tds: item.electricConductivity
            ? (item.electricConductivity * 0.65).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          waterLevel: item.waterLevel
            ? Number(item.waterLevel).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
          currentVolume: item.currentVolume
            ? Number(item.currentVolume).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-',
        };
      });

      // Sort the data based on the selected sort order
      processedData.sort((a, b) => {
        const sortMultiplier = exportSortOrder.value === 'asc' ? 1 : -1;
        return (a.date - b.date) * sortMultiplier;
      });

      // Remove the raw date field before CSV conversion
      processedData = processedData.map((item) => {
        const { date, ...rest } = item;
        return rest;
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
        `${localStorage.getItem('stationName')}_from_${new Date(fromDate.value).getDate()}/${new Date(fromDate.value).getMonth() + 1}/${new Date(fromDate.value).getFullYear()}_to_${new Date(toDate.value).getDate()}/${new Date(toDate.value).getMonth() + 1}/${new Date(toDate.value).getFullYear()}_${exportSortOrder.value}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      isExporting.value = false;
    }
  };

  // Add a helper function for consistent number formatting
  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0.00';
    return Number(value).toFixed(2);
  };

  // Single source of truth for initialization
  const initializeStation = async (stationId, isNewStation = false) => {
    if (process.client) {
      const currentStationId = localStorage.getItem('currentStationId');

      // Check if we're actually changing stations
      const isStationChange = currentStationId !== stationId.toString();

      // Reset store data if we're changing stations
      if (isStationChange) {
        stationDataStore.$reset();
        localStorage.setItem('currentStationId', stationId.toString());
      }

      // Update station info
      stationName.value = localStorage.getItem('stationName') || 'N/A';
      stationCity.value = localStorage.getItem('stationCity') || 'N/A';
      stationType.value = parseInt(localStorage.getItem('stationType') || '0');

      // Reset date range to default (last 14 days) if it's a station change
      if (isStationChange) {
        const defaultFromDate = new Date();
        defaultFromDate.setDate(defaultFromDate.getDate() - 14);
        fromDate.value = dateUtils.startOfDay(defaultFromDate);
        toDate.value = dateUtils.endOfDay(new Date());

        // Update store date range
        stationDataStore.setDateRange(fromDate.value, toDate.value);
      }

      // Always fetch new data when initializing a station
      await fetchData();
    }
  };

  // Watch for station ID changes
  watch(
    () => route.params.id,
    async (newId, oldId) => {
      if (newId !== oldId) {
        await initializeStation(parseInt(newId, 10), true);
      }
    }
  );

  // Component initialization
  onMounted(async () => {
    const stationId = parseInt(route.params.id, 10);
    await initializeStation(stationId);
  });
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
