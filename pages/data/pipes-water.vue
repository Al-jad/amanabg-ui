<template>
  <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div class="bg-white p-8 shadow sm:rounded-lg">
      <h1 class="mb-6 text-left text-3xl font-bold text-gray-900 sm:mx-[10%] sm:text-2xl">
        Pipes Water
      </h1>
      <div>
        <Table v-if="!loading && pipesData && pipesData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="pipesData"
          @row-click="onRowClick"
        />
        <div v-else-if="loading" class="flex items-center justify-center">
          <p class="text-gray-500">Loading data...</p>
          <span class="ml-2 animate-spin">&#8987;</span>
        </div>
        <div v-else class="flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
        </div>
      </div>
      <div class="mt-4 text-sm text-gray-600">
        <p>Data source: {{ dataSource }}</p>
        <p v-if="lastUpdated">Last updated: {{ lastUpdated }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStationStore } from '@/stores/stationData';
import { storeToRefs } from 'pinia';

const router = useRouter();
const { $axios } = useNuxtApp();

const onRowClick = (event) => {
  if (!event?.data?.Id || !event.data.Station?.City || !event.data.Station?.Name) {
    console.error("Invalid event or missing required station data");
    return;
  }

  const { Id: stationId, Station: { City: stationCity, Name: stationName } } = event.data;

  nextTick(() => {
    localStorage.setItem("stationCity", stationCity);
    localStorage.setItem("stationName", stationName);
    router.push({ path: `/data/details/${stationId}` });
  });
};

const headers = [
  {
    text: "Station Info",
    colspan: 3,
    class: "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  {
    text: "Last Measurement",
    colspan: 7,
    class: "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
];

const columns = [
  { header: "ID", sortable: true, field: "id" },
  { header: "Name", sortable: true, field: "station.name" },
  { header: "City", sortable: true, field: "station.city" },
  { header: "Discharge", sortable: true, field: "discharge" },
  { header: "Total Volume/Hour", sortable: true, field: "totalVolumePerHour" },
  { header: "Total Volume/Day", sortable: true, field: "totalVolumePerDay" },
  { header: "Pressure", sortable: true, field: "pressure" },
  { header: "CL", sortable: true, field: "cl" },
  { header: "Turbidity", sortable: true, field: "turbidity" },
  { header: "Electric Conductivity", sortable: true, field: "electricConductivity" },
].map(column => ({
  ...column,
  class: "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white",
}));

const stationStore = useStationStore();
const { pipesData: storePipesData, connection } = storeToRefs(stationStore);

const pipesData = computed(() => {
  return Array.isArray(storePipesData.value) ? storePipesData.value : [storePipesData.value];
});
const dataSource = ref('API');
const lastUpdated = ref(null);
const loading = ref(true);

const fetchInitialData = async () => {
  loading.value = true;
  try {
    const { data } = await $axios.get('/Pipes/latest_data');
    stationStore.setPipesData(data);
    dataSource.value = 'API';
    lastUpdated.value = new Date().toLocaleString();
  } catch (error) {
    console.error('Error fetching initial data:', error);
  } finally {
    loading.value = false;
  }
};

watch(storePipesData, (newValue) => {
  if (newValue) {
    lastUpdated.value = new Date().toLocaleString();
    if (connection.value && connection.value.state === 1) {
      dataSource.value = 'WebSocket';
    }
    console.log(`Data updated from ${dataSource.value}`);
    console.log(newValue);
    loading.value = false;
  }
}, { deep: true });

onMounted(async () => {
  await fetchInitialData();
  stationStore.connect();
});

</script>
