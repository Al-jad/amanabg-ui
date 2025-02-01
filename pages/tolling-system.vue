<template>
  <div class="container mx-auto px-4 py-4 sm:py-6 md:py-8">
    <NuxtLink
      to="/"
      class="mb-4 flex items-center text-DarkBlue transition-colors duration-300 hover:text-DarkBlue/80"
    >
      <Icon
        name="mdi:arrow-left"
        class="mr-2"
      />
      Back
    </NuxtLink>
    <h1 class="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
      Water Discharge Tolling System
    </h1>

    <!-- Date range selection and submit button -->
    <div
      class="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <!-- From date picker -->
      <div class="w-full">
        <label
          for="fromDate"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          From
        </label>
        <DatePicker
          v-model="fromDate"
          dateFormat="dd/mm/yy"
          class="w-full"
        />
        hello worlds
      </div>
      <!-- To date picker -->
      <div class="w-full">
        <label
          for="toDate"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          To
        </label>
        <DatePicker
          v-model="toDate"
          dateFormat="dd/mm/yy"
          class="w-full"
        />
      </div>
      <!-- Submit button -->
      <div class="flex w-full items-end">
        <Button
          @click="fetchTollingData"
          label="Submit"
          class="w-full !border-none !bg-DarkBlue !text-white"
        />
      </div>
    </div>

    <!-- Data table for tolling data -->
    <div
      v-if="tollingData.length > 0"
      class="overflow-x-auto"
    >
      <DataTable
        :value="tollingData"
        :rows="10"
        :paginator="true"
        :scrollable="true"
        removableSort
        class="text-nowrap !bg-DarkBlue"
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
            <span>{{ slotProps.data[col.field] }}</span>
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
    </div>
    <!-- Fallback message when no data is available -->
    <div
      v-else
      class="py-4 text-center"
    >
      No data available
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
      class:
        '!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white font-semibold py-2',
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
          const data = stationDataDayStore.dailyData.filter(
            (station) => !station.stationName.toLowerCase().includes('tank')
          );

          const processChunk = (startIndex) => {
            const chunk = data.slice(startIndex, startIndex + chunkSize);
            if (chunk.length === 0) return;

            const processedChunk = chunk.map((station) => ({
              stationName: station.stationName,
              discharge: formatNumber(station.dailyDischarge),
              price: formatNumber(500) + ' IQD',
              total: formatNumber(station.dailyDischarge * 500) + ' IQD',
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
    @apply !bg-gray-200 !text-black;
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
</style>
