<template>
  <div class="container px-4 py-8 mx-auto">
    <div v-if="dataLoading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="dataError" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ dataError }}</p>
    </div>
    <div
      v-else-if="
        (hourlyData && hourlyData.length > 0) ||
        (minuteData && minuteData.length > 0)
      "
    >
      <div class="flex flex-col items-start gap-4 mb-8">
        <NuxtLink
          to="/data/pipes-water"
          class="flex items-center transition-colors duration-300 text-DarkBlue hover:text-DarkBlue/80"
        >
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to All Stations
        </NuxtLink>
        <div
          class="flex flex-col items-start justify-between w-full gap-4 p-6 py-2 sm:p-4 sm:py-1"
        >
          <div
            class="flex items-center justify-between w-full sm:flex-col sm:items-stretch sm:gap-4"
          >
            <h1 class="text-xl font-bold text-gray-800 sm:text-left">
              {{ stationName || "Station name not found" }}
            </h1>
            <div class="flex items-center gap-2 sm:flex-col sm:gap-4">
              <div class="flex flex-row items-center gap-2">
                <div class="flex flex-row items-center gap-2">
                  <div class="flex flex-row items-center gap-2">
                    <label for="from">From</label>
                    <DatePicker
                      v-model="fromDate"
                      dateFormat="dd/mm/yy"
                      class="h-8 sm:h-10"
                      @change="applyDateFilter"
                    />
                  </div>
                  <div class="flex flex-row items-center gap-2">
                    <label for="to">To</label>
                    <DatePicker
                      v-model="toDate"
                      dateFormat="dd/mm/yy"
                      class="h-8 sm:h-10"
                      @change="applyDateFilter"
                    />
                  </div>
                </div>
                <Button
                  @click="resetDateFilter"
                  label="Reset"
                  class="!border-none !bg-DarkBlue !text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 bg-white rounded-lg shadow-lg sm:p-4">
        <Table
          :value="filteredData"
          :columns="columns"
          class="w-full"
          :sortField="'timeStamp'"
          :sortOrder="-1"
          @row-click="onRowClick"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-base text-gray-600 sm:text-lg">No data available</p>
    </div>
    <div>
      <EChart
        v-if="formattedHourlyData.length > 0"
        :hourlyData="formattedHourlyData"
        :includeTDS="true"
        :paramNames="paramNames"
        :units="units"
        :selectedParam="selectedParam"
      />
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
const stationDataHourStore = useStationDataHourStore();
const {
  hourlyData,
  loading: hourLoading,
  error: hourError,
} = storeToRefs(stationDataHourStore);
const startOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
const endOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};
const subtractMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};
const fromDate = ref(startOfDay(subtractMonths(new Date(), 3)));
const toDate = ref(endOfDay(new Date()));
const minuteDate = ref(null);
const minuteDateError = ref("");
const { fetchHourlyData, fetchMinuteData: fetchMinuteDataStore } =
  stationDataHourStore;
const dataLoading = computed(() => hourLoading.value);
const dataError = computed(() => hourError.value);
const dataType = ref("Hourly");
const paramNames = {
  q1Hour: {
    short: "Q1 (h)",
    full: "Q1 ( Hour )",
  },
  q2Hour: {
    short: "Q2 (h)",
    full: "Q2 ( Hour )",
  },
  qDay: {
    short: "Q (d)",
    full: "Q ( Day )",
  },
  pressure1: {
    short: "P1",
    full: "Pressure 1",
  },
  pressure2: {
    short: "P2",
    full: "Pressure 2",
  },
  turbidity: {
    short: "Turb.",
    full: "Turbidity",
  },
  cl: {
    short: "Cl",
    full: "Chlorine",
  },
  tds: {
    short: "TDS",
    full: "Total Dissolved Solids",
  },
  temp: {
    short: "Temp",
    full: "Temperature",
  },
};
const columns = computed(() => {
  const baseColumns = [
    { header: "Date", sortable: true, field: "date" },
    { header: "Time", sortable: true, field: "time" },
    {
      header: "Q1 ( Hour )",
      sortable: true,
      field: "discharge",
      unit: "m³/h",
      defaultValue: "-"
    },
    {
      header: "Q2 ( Hour )",
      sortable: true,
      field: "discharge2",
      unit: "m³/d",
      defaultValue: "-"
    },
    { 
      header: "P1", 
      sortable: true, 
      field: "pressure", 
      unit: "Bar",
      defaultValue: "-"
    },
    { 
      header: "P2", 
      sortable: true, 
      field: "pressure2", 
      unit: "Bar",
      defaultValue: "-"
    },
    { 
      header: "Temp", 
      sortable: true, 
      field: "temperature", 
      unit: "C",
      defaultValue: "-"
    },
    { 
      header: "Cl⁺", 
      sortable: true, 
      field: "cl", 
      unit: "mg/L",
      defaultValue: "-"
    },
    { 
      header: "Turb", 
      sortable: true, 
      field: "turbidity", 
      unit: "NTU",
      defaultValue: "-"
    },
    {
      header: "TDS",
      sortable: true,
      field: "tds",
      unit: "ppm",
      defaultValue: "-"
    },
  ];
  return baseColumns.map((column) => ({
    ...column,
    class: "!bg-DarkBlue !outline !outline-1 !outline-white !text-white font-semibold py-1 sm:py-2",
  }));
});
const fetchData = async () => {
  const stationId = parseInt(route.params.id, 10);
  if (isNaN(stationId)) {
    console.error("Invalid station ID");
    return;
  }
  await stationDataHourStore.fetchHourlyData({
    stationId,
    fromDate: fromDate.value,
    toDate: toDate.value,
  });
};
const applyDateFilter = () => {
  if (fromDate.value && toDate.value) {
    fromDate.value.setHours(0, 0, 0, 0);
    toDate.value.setHours(23, 59, 59, 999);
  }
};
const resetDateFilter = () => {
  fromDate.value = startOfDay(subtractMonths(new Date(), 3));
  toDate.value = endOfDay(new Date());
  fetchData();
};
const resetToHourlyData = () => {
  dataType.value = "Hourly";
  minuteDate.value = null;
  minuteDateError.value = "";
};
const units = {
  q1Hour: "m³/h",
  q2Hour: "m³/h",
  qDay: "m³/d", 
  pressure1: "Bar",
  pressure2: "Bar",
  turbidity: "NTU",
  cl: "mg/L",
  tds: "ppm",
  temp: "C",
};
const formattedHourlyData = computed(() => {
  if (!hourlyData.value || hourlyData.value.length === 0) return [];
  return hourlyData.value
    .filter((item) => item != null)
    .map((item) => {
      const date = new Date(item.timeStamp);
      const tds = item.electricConductivity
        ? (item.electricConductivity * 0.65).toFixed(2)
        : null;
      return {
        ...item,
        date: date.toLocaleDateString("en-GB"),
        time: date.toLocaleTimeString("en-US"),
        tds: tds ? parseFloat(tds) : 0,
        q1Hour: item.discharge || 0,
        q2Hour: item.discharge2 || 0,
        qDay: item.totalVolumePerDay || 0,
        pressure1: item.pressure || 0,
        pressure2: item.pressure2 || 0,
        timeStamp: date,
        temp: item.temperature || "0",
      };
    })
    .sort((a, b) => b.timeStamp - a.timeStamp);
});
const formattedMinuteData = computed(() => {});
const filteredData = computed(() => {
  if (!fromDate.value || !toDate.value) return formattedHourlyData.value;
  return formattedHourlyData.value.filter((item) => {
    return item.timeStamp >= fromDate.value && item.timeStamp <= toDate.value;
  });
});
const stationName = ref("N/A");
const stationCity = ref("N/A");
const router = useRouter();
onMounted(() => {
  fetchData();
  if (process.client) {
    stationName.value = window.localStorage.getItem("stationName") || "N/A";
    stationCity.value = window.localStorage.getItem("stationCity") || "N/A";
  }
});
watch([fromDate, toDate], applyDateFilter);
const onRowClick = (event) => {
  const clickedDate = new Date(event.data.timeStamp);
  const formattedDate = clickedDate.toISOString().split("T")[0];
  const minuteDataUrl = `/data/details/perMinute/${route.params.id}?date=${formattedDate}&stationName=${encodeURIComponent(stationName.value)}`;
  window.open(minuteDataUrl, "_blank");
};
const minuteData = ref([]);
const selectedParam = ref("q1Hour");
</script>
<style>
.p-datepicker-input {
  @apply !bg-gray-200 text-sm !text-black sm:text-base;
}
</style>
