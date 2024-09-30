<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="hourlyDataLoading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="hourlyDataError" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ hourlyDataError }}</p>
    </div>
    <div v-else-if="hourlyData && hourlyData.length > 0">
      <div class="flex flex-col justify-between md:flex-row">
        <h1 class="mb-6 text-2xl font-bold text-gray-800">Station Details</h1>
      </div>
      <div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <p class="mb-2">
          <strong class="text-gray-600">Name: </strong>
          <span class="text-gray-800">{{ stationName || 'N/A' }}</span>
        </p>
        <p class="mb-2">
          <strong class="text-gray-600">City: </strong>
          <span class="text-gray-800">{{ stationCity || 'N/A' }}</span>
        </p>
        <div class="mr-4 flex items-center gap-4">
          <label for="from">From</label>
          <DatePicker
            v-model="fromDate"
            dateFormat="dd/mm/yy"
            class="h-10"
            @change="applyDateFilter"
          />
          <label for="to">To</label>
          <DatePicker
            v-model="toDate"
            dateFormat="dd/mm/yy"
            class="h-10"
            @change="applyDateFilter"
          />
          <button @click="resetDateFilter" class="bg-DarkBlue hover:bg-DarkBlue/90 text-white font-bold py-2 px-4 rounded">
            Reset
          </button>
        </div>
      </div>
      <div class="rounded-lg bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Hourly Data</h2>
        <Table
          :value="formattedHourlyData"
          :headers="headers"
          :columns="columns"
          class="w-full"
          :sortField="'time'"
          :sortOrder="1"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-lg text-gray-600">No data available</p>
    </div>
    <div>
      <EChart :hourlyData="hourlyData" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useStationDataHourStore } from '~/stores/stationDataHour';
import { storeToRefs } from 'pinia';

const route = useRoute();
const stationDataHourStore = useStationDataHourStore();

const { hourlyData, loading, error } = storeToRefs(stationDataHourStore);

const fromDate = ref(null);
const toDate = ref(null);
const { fetchHourlyData } = stationDataHourStore;


const hourlyDataLoading = computed(() => loading.value);
const hourlyDataError = computed(() => error.value);

const headers = ref([
  {
    text: "Hourly Data",
    colspan: 9,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white font-bold py-3",
  },
]);

const columns = ref(
  [
    { header: "Date", sortable: true, field: "date" },
    { header: "Time", sortable: true, field: "time" },
    { header: "Q ( m3 / h )", sortable: true, field: "discharge" },
    {
      header: "Total Volume/Hour",
      sortable: true,
      field: "totalVolumePerHour",
    },
    { header: "Total Volume/Day", sortable: true, field: "totalVolumePerDay" },
    { header: "Pressure", sortable: true, field: "pressure" },
    { header: "CL", sortable: true, field: "cl" },
    { header: "Turbidity", sortable: true, field: "turbidity" },
    {
      header: "Electric Conductivity",
      sortable: true,
      field: "electricConductivity",
    },
  ].map((column) => ({
    ...column,
    class:
      "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white font-semibold py-2",
  })),
);

const fetchData = async () => {
  const stationId = parseInt(route.params.id, 10);
  if (isNaN(stationId)) {
    console.error('Invalid station ID');
    return;
  }
  await stationDataHourStore.fetchHourlyData({ stationId });
};

const applyDateFilter = () => {
  if (fromDate.value && toDate.value) {
    fromDate.value.setHours(0, 0, 0, 0);
    toDate.value.setHours(23, 59, 59, 999);
  }
};

const resetDateFilter = () => {
  fromDate.value = null;
  toDate.value = null;
};

const formattedHourlyData = computed(() => {
  if (!hourlyData.value) return [];
  
  return hourlyData.value.map(item => {
    const date = new Date(item.timeStamp);
    return {
      ...item,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  });
});

const stationName = ref('N/A');
const stationCity = ref('N/A');

onMounted(() => {
  fetchData();
  if (process.client) {
    stationName.value = window.localStorage.getItem('stationName') || 'N/A';
    stationCity.value = window.localStorage.getItem('stationCity') || 'N/A';
    window.localStorage.removeItem('stationName');
    window.localStorage.removeItem('stationCity');
  }
});

watch([fromDate, toDate], applyDateFilter);
</script>
