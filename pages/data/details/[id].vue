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
          <span class="text-gray-800">{{ stationInfo.name }}</span>
        </p>
        <p class="mb-2">
          <strong class="text-gray-600">City: </strong>
          <span class="text-gray-800">{{ stationInfo.city }}</span>
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
          :value="filteredHourlyData"
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStationDataHourStore } from "@/stores/stationDataHour";

const route = useRoute();
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
  return hourlyData.value[0].pipesData.map((item) => {
    const date = new Date(item.pipe.timeStamp);
    return {
      ...item.pipe,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      timeStamp: date.toLocaleString(),
    };
  });
});

const filteredHourlyData = computed(() => {
  if (!fromDate.value || !toDate.value) return formattedHourlyData.value;
  return formattedHourlyData.value.filter((item) => {
    const itemDate = new Date(item.timeStamp);
    return itemDate >= fromDate.value && itemDate <= toDate.value;
  });
});

const hourlyDataLoading = computed(() => stationDataHourStore.isLoading);
const hourlyDataError = computed(() => stationDataHourStore.getError);

const headers = ref([
  {
    text: "Hourly Data",
    colspan: 8,
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
  const stationId = route.params.id;
  await fetchHourlyData({ stationId });
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

onMounted(fetchData);

watch([fromDate, toDate], applyDateFilter);
</script>
