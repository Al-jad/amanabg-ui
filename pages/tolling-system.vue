<template>
  <div class="container mx-auto px-4 py-4 sm:py-6 md:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Water Discharge Tolling System</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
      <div class="w-full">
        <label for="fromDate" class="block text-sm font-medium text-gray-700 mb-1">From</label>
        <DatePicker v-model="fromDate" dateFormat="dd/mm/yy" class="w-full" />
      </div>
      <div class="w-full">
        <label for="toDate" class="block text-sm font-medium text-gray-700 mb-1">To</label>
        <DatePicker v-model="toDate" dateFormat="dd/mm/yy" class="w-full" />
      </div>
      <div class="flex items-end w-full">
        <Button @click="fetchTollingData" label="Submit" class="w-full !bg-DarkBlue !text-white !border-none" />
      </div>
    </div>
    <div v-if="tollingData.length > 0" class="overflow-x-auto">
      <DataTable
        :value="tollingData"
        :rows="10"
        :paginator="true"
        :scrollable="true"
        removableSort
        class="text-nowrap !bg-DarkBlue"
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable" :headerClass="col.class">
          <template #body="slotProps">
            <span>{{ slotProps.data[col.field] }}</span>
          </template>
        </Column>
        <template #empty>
          <div class="m-0 bg-DarkBlue p-4 text-center text-white">No data available</div>
        </template>
        <template #paginatorstart>
          <div class="text-sm text-white">
            Showing max 10 of {{ tollingData.length }} entries
          </div>
        </template>
      </DataTable>
    </div>
    <div v-else class="text-center py-4">No data available</div>
  </div>
</template>

<script setup>
const fromDate = ref(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const toDate = ref(new Date());
const tollingData = ref([]);
const columns = [
  { field: 'stationName', header: 'Station Name', sortable: true },
  { field: 'discharge', header: 'Volume (m³)', sortable: true },
  { field: 'price', header: 'Price per m³ (IQD)', sortable: true },
  { field: 'total', header: 'Total (IQD)', sortable: true }
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white font-semibold py-2",
}));

const stationDataDayStore = useStationDataDayStore();

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const fetchTollingData = async () => {
  if (!fromDate.value || !toDate.value) {
    console.error('Please select both start and end dates');
    return;
  }

  try {
    await stationDataDayStore.fetchDailyData({
      startDate: fromDate.value,
      endDate: toDate.value
    });

    if (stationDataDayStore.dailyData && stationDataDayStore.dailyData.length > 0) {
      tollingData.value = stationDataDayStore.dailyData.map(station => ({
        stationName: station.stationName,
        discharge: formatNumber(station.dailyDischarge),
        price: formatNumber(500) + " IQD",
        total: formatNumber(station.dailyDischarge * 500) + " IQD"
      }));
    }
  } catch (error) {
    console.error('Error fetching tolling data:', error);
  }
};

onMounted(fetchTollingData);
</script>

<style>
.p-datepicker-input {
  @apply !bg-gray-200 !text-black;
}

.p-datatable-sort-icon {
  @apply !text-white sm:scale-75;
}
.p-datatable tr {
  @apply !bg-DarkBlue cursor-pointer;
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
  @apply !bg-gray-300 !text-black !cursor-pointer;
}

</style>
