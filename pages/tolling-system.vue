<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 sm:px-2 lg:px-8">
      <div class="relative overflow-hidden rounded-xl bg-red-100 p-6 shadow-lg">
        <!-- Demo Version Ribbon -->
        <div
          class="absolute right-[-3rem] top-[2rem] z-10 w-[12rem] rotate-45 bg-gradient-to-r from-red-600 to-red-500 py-1 text-center text-xs shadow-md"
        >
          <span class="text-xs font-semibold tracking-wide text-white">
            DEMO VERSION
          </span>
        </div>

        <!-- Header Section -->
        <div
          class="mb-8 flex flex-col gap-6 sm:flex-col md:flex-row md:items-center md:justify-between"
        >
          <!-- Left Side -->
          <div class="flex flex-col items-start gap-4">
            <NuxtLink
              to="/"
              class="group flex items-center text-DarkBlue transition-all duration-300 hover:translate-x-[-0.25rem]"
            >
              <Icon
                name="mdi:arrow-left"
                class="mr-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span class="font-medium">Back to Dashboard</span>
            </NuxtLink>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-50 p-2">
                <Icon
                  name="mdi:cash-register"
                  class="text-2xl text-blue-600"
                />
              </div>
              <div class="flex flex-row items-center">
                <h1 class="text-2xl font-bold text-gray-900">
                  Water Discharge Tolling System
                  <span class="ml-2 font-bold text-red-500">
                    (Demo Version)
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <!-- Date range selection and submit button -->
        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- From date picker -->
          <div class="w-full">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              From
            </label>
            <DatePicker
              v-model="fromDate"
              dateFormat="dd/mm/yy"
              class="w-full"
              :pt="{
                input: { class: '!bg-gray-50 !border-gray-200' },
              }"
            />
          </div>
          <!-- To date picker -->
          <div class="w-full">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              To
            </label>
            <DatePicker
              v-model="toDate"
              dateFormat="dd/mm/yy"
              class="w-full"
              :pt="{
                input: { class: '!bg-gray-50 !border-gray-200' },
              }"
            />
          </div>
          <!-- Submit button -->
          <div class="flex w-full items-end">
            <Button
              @click="fetchTollingData"
              class="group flex w-full items-center justify-center gap-2 !border-none !bg-DarkBlue !px-6 !text-white transition-all duration-300 hover:!bg-DarkBlue/90"
            >
              <span>Submit</span>
              <Icon
                name="formkit:submit"
                class="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Button>
          </div>
        </div>

        <!-- Data table for tolling data -->
        <div
          v-if="tollingData.length > 0"
          class="border border-gray-100 bg-white p-4 shadow-sm"
        >
          <DataTable
            :value="tollingData"
            :rows="10"
            :paginator="true"
            :scrollable="true"
            removableSort
            class="text-nowrap !bg-DarkBlue"
            :pt="{
              root: { class: '!overflow-hidden' },
              header: { class: '!bg-gray-50' },
              headerCell: { class: '!py-4' },
              bodyRow: { class: '!sm:text-sm' },
            }"
          >
            <!-- Dynamic columns based on the columns array -->
            <Column
              v-for="col of columns"
              :key="col.field"
              :field="col.field"
              :header="col.header"
              :sortable="col.sortable"
              :headerClass="col.class"
            >
              <template #body="slotProps">
                <div class="text-center">
                  {{ slotProps.data[col.field] }}
                </div>
              </template>
            </Column>
            <!-- Empty state template -->
            <template #empty>
              <div class="m-0 bg-DarkBlue p-4 text-center text-white">
                No data available
              </div>
            </template>
            <!-- Custom paginator start template -->
            <template #paginatorstart>
              <div class="text-sm text-white">
                Showing max 10 of {{ tollingData.length }} entries
              </div>
            </template>
          </DataTable>

          <!-- Table Legend -->
          <div
            class="space-y-2 border-t border-gray-100 bg-gray-50 p-6 text-sm text-gray-600"
          >
            <p>
              * Volume ( m³ ) = Total discharge volume in the selected period
            </p>
            <p>* Price per m³ ( IQD ) = Cost per cubic meter of water</p>
            <p>* Total ( IQD ) = Total cost for the discharged water</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
        >
          <div class="text-center">
            <Icon
              name="mdi:database-off"
              class="mb-3 text-4xl text-gray-400"
            />
            <p class="text-gray-600">No data available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // Memoize the initial dates to prevent unnecessary recalculations
  const initialFromDate = new Date();
  initialFromDate.setMonth(initialFromDate.getMonth() - 1);
  initialFromDate.setHours(0, 0, 0, 0);

  const initialToDate = new Date();
  initialToDate.setHours(23, 59, 59, 999);

  // Initial date range (last month to today)
  const fromDate = ref(initialFromDate);
  const toDate = ref(initialToDate);

  // Reactive reference for tolling data
  const tollingData = ref([]);

  // Memoize columns to prevent recreation on each render
  const columns = computed(() =>
    [
      { field: 'stationName', header: 'Station Name', sortable: true },
      { field: 'discharge', header: 'Volume (m³)', sortable: true },
      { field: 'price', header: 'Price per m³ (IQD)', sortable: true },
      { field: 'total', header: 'Total (IQD)', sortable: true },
    ].map((column) => ({
      ...column,
      class: '!bg-DarkBlue !outline !outline-1 !outline-white !text-white',
    }))
  );

  // Store for fetching station data
  const stationDataDayStore = useStationDataDayStore();

  // Memoize the formatter function
  const formatNumber = (number) => {
    if (typeof number !== 'number') return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to fetch and process tolling data with debouncing
  let fetchTimeout;
  const fetchTollingData = async () => {
    if (!fromDate.value || !toDate.value) {
      console.error('Please select both start and end dates');
      return;
    }

    // Clear any pending fetch
    clearTimeout(fetchTimeout);

    // Debounce the fetch operation
    fetchTimeout = setTimeout(async () => {
      try {
        await stationDataDayStore.fetchDailyData({
          startDate: fromDate.value,
          endDate: toDate.value,
        });

        if (
          stationDataDayStore.dailyData &&
          stationDataDayStore.dailyData.length > 0
        ) {
          // Process data in chunks to avoid blocking the main thread
          const chunkSize = 100;
          // Filter out tanks (stationType === 1) and stations with zero discharge
          const data = stationDataDayStore.dailyData.filter(
            (station) => station.stationType !== 1 && station.dailyDischarge > 0
          );

          const processChunk = (startIndex) => {
            const chunk = data.slice(startIndex, startIndex + chunkSize);
            if (chunk.length === 0) return;

            const processedChunk = chunk.map((station) => ({
              stationName: station.stationName,
              discharge: formatNumber(station.dailyDischarge),
              price: formatNumber(10) + ' IQD',
              total: formatNumber(station.dailyDischarge * 10) + ' IQD',
            }));

            tollingData.value = tollingData.value.concat(processedChunk);

            if (startIndex + chunkSize < data.length) {
              requestAnimationFrame(() => processChunk(startIndex + chunkSize));
            }
          };

          // Start processing with empty array
          tollingData.value = [];
          processChunk(0);
        }
      } catch (error) {
        console.error('Error fetching tolling data:', error);
      }
    }, 300); // 300ms debounce
  };

  // Fetch data on component mount
  onMounted(() => {
    fetchTollingData();

    // Cleanup on unmount
    onUnmounted(() => {
      clearTimeout(fetchTimeout);
    });
  });
</script>

<style>
  /* Custom styles for PrimeVue components */
  .p-datepicker-input {
    @apply !border-gray-200 !bg-gray-50 !text-black;
  }

  .p-datatable-sort-icon {
    @apply !text-white sm:scale-75;
  }

  .p-datatable tr {
    @apply cursor-pointer !bg-DarkBlue;
  }

  .p-paginator {
    @apply !bg-DarkBlue !text-white;
  }

  .p-datatable .p-datatable-tbody > tr.p-row-even {
    @apply !bg-white !text-black;
  }

  .p-datatable .p-datatable-tbody > tr.p-row-odd {
    @apply !bg-gray-100 !text-black;
  }

  .p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
    @apply !cursor-pointer !bg-gray-300 !text-black;
  }

  .p-paginator .p-paginator-current {
    @apply !text-white;
  }

  .p-paginator .p-paginator-pages .p-paginator-page {
    @apply bg-DarkBlue !text-white hover:!bg-DarkNavy focus:!bg-DarkNavy;
  }

  .p-paginator .p-paginator-pages .p-paginator-page-selected {
    @apply bg-DarkNavy !text-white;
  }

  .p-paginator .p-paginator-first,
  .p-paginator .p-paginator-prev,
  .p-paginator .p-paginator-next,
  .p-paginator .p-paginator-last {
    @apply !text-white hover:!bg-DarkBlue/80;
  }

  /* Responsive styles */
  @media (max-width: 640px) {
    .p-paginator-button {
      @apply px-2 py-1;
    }

    .p-paginator-dropdown {
      @apply px-2 py-1 text-xs;
    }
  }
</style>
