<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="hourlyDataLoading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="hourlyDataError" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ hourlyDataError }}</p>
    </div>
    <div v-else-if="hourlyData && hourlyData.length > 0">
      <div class="flex flex-col md:flex-row justify-between">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Station Details</h1>
        <div class="flex gap-4 mr-4 items-center">
          <label for="from">From</label>
          <DatePicker v-model="fromDate" dateFormat="dd/mm/yy" class="h-10" />
          <label for="to">To</label>
          <DatePicker v-model="toDate" dateFormat="dd/mm/yy" class="h-10" />
        </div>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <p class="mb-2"><strong class="text-gray-600">Name:</strong> <span class="text-gray-800">{{ stationInfo.name }}</span></p>
        <p class="mb-2"><strong class="text-gray-600">City:</strong> <span class="text-gray-800">{{ stationInfo.city }}</span></p>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">Hourly Data</h2>
        <Table
          :value="formattedHourlyData"
          :headers="headers"
          :columns="columns"
          class="w-full"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-lg text-gray-600">No data available</p>
    </div>
  </div>
</template>

<script setup>
const stationDataHourStore = useStationDataHourStore();

const fromDate = ref(null);
const toDate = ref(null);
const { fetchHourlyData } = stationDataHourStore;

const hourlyData = computed(() => {
  const data = stationDataHourStore.getHourlyData;
  return data ? (Array.isArray(data) ? data : [data]) : [];
});

const stationInfo = computed(() => {
  return hourlyData.value[0]?.station || {};
});

const formattedHourlyData = computed(() => {
  if (hourlyData.value.length === 0) return [];
  return hourlyData.value[0].pipesData.map(item => {
    const date = new Date(item.pipe.timeStamp);
    return {
      ...item.pipe,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      timeStamp: date.toLocaleString()
    };
  });
});


const hourlyDataLoading = computed(() => stationDataHourStore.isLoading);
const hourlyDataError = computed(() => stationDataHourStore.getError);

const headers = ref([
  {
    text: "Hourly Data",
    colspan: 8,
    class: "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white font-bold py-3",
  },
]);

const columns = ref([
  { header: "Date", sortable: true, field: "date" },
  { header: "Time", sortable: true, field: "time" },
  { header: "Q ( m3 / h )", sortable: true, field: "discharge" },
  { header: "Total Volume/Hour", sortable: true, field: "totalVolumePerHour" },
  { header: "Total Volume/Day", sortable: true, field: "totalVolumePerDay" },
  { header: "Pressure", sortable: true, field: "pressure" },
  { header: "CL", sortable: true, field: "cl" },
  { header: "Turbidity", sortable: true, field: "turbidity" },
  { header: "Electric Conductivity", sortable: true, field: "electricConductivity" },
].map(column => ({
  ...column,
  class: "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white font-semibold py-2",
})));

onMounted(async () => {
  await fetchHourlyData();
});
</script>