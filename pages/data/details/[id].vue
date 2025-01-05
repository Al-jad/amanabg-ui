<template>
  <div class="container px-4 py-8 mx-auto">
    <div v-if="dataLoading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="dataError" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ dataError }}</p>
    </div>
    <div v-else-if="filteredData && filteredData.length > 0">
      <div class="flex flex-col items-start gap-4 mb-8">
        <NuxtLink
          to="/data/pipes-water"
          class="flex items-center transition-colors duration-300 text-DarkBlue hover:text-DarkBlue/80"
        >
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to All Stations
        </NuxtLink>
        <div class="flex items-center gap-4">
          <label class="text-gray-700">Data Frequency:</label>
          <Select
            v-model="selectedFrequency"
            :options="frequencyOptions"
            optionLabel="label"
            optionValue="value"
            class="w-40"
            @change="handleFrequencyChange"
          />
        </div>
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
          :paginator="selectedFrequency === 'minute' || selectedFrequency === 'hour'"
          :rows="10"
          :totalRecords="pagination.total"
          :first="pagination.skip"
          :lazy="true"
          :loading="dataLoading"
          @page="onPageChange"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-base text-gray-600 sm:text-lg">No data available</p>
    </div>
    <div>
      <EChart
        v-if="chartData.length > 0"
        :hourlyData="chartData"
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
const dataLoading = computed(() => {
  switch (selectedFrequency.value) {
    case 'minute': return stationDataMinuteStore.loading;
    case 'hour': return hourLoading.value;
    case 'day': return stationDataDayStore.loading;
  }
});
const dataError = computed(() => {
  switch (selectedFrequency.value) {
    case 'minute': return stationDataMinuteStore.error;
    case 'hour': return hourError.value;
    case 'day': return stationDataDayStore.error;
  }
});
const dataType = ref("Hourly");
const paramNames = {
  discharge: {
    short: "Q (min)",
    full: "Q ( Minute )",
  },
  qHour: {
    short: "Q (h)",
    full: "Q ( Hour )",
  },
  qDay: {
    short: "Q (d)",
    full: "Q ( Day )",
  },
  pressure: {
    short: "P",
    full: "Pressure",
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
    { header: "DateTime", sortable: true, field: "dateTime" },
    {
      header: "Q ( Min )",
      sortable: true,
      field: "discharge",
      unit: "m³/min",
      defaultValue: "-"
    },
    {
      header: "Q ( Hour )",
      sortable: true,
      field: "totalVolumePerHour",
      unit: "m³/h",
      defaultValue: "-"
    },
    {
      header: "Q ( Day )",
      sortable: true,
      field: "totalVolumePerDay",
      unit: "m³/d",
      defaultValue: "-"
    },
    { 
      header: "P", 
      sortable: true, 
      field: "pressure", 
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
  await handleFrequencyChange();
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
  q: "m³/min",
  qHour: "m³/h",
  qDay: "m³/d", 
  pressure: "Bar",
  turbidity: "NTU",
  cl: "mg/L",
  tds: "ppm",
  temp: "C",
};
const formattedHourlyData = computed(() => {
  if (!hourlyData.value?.data || !Array.isArray(hourlyData.value.data) || hourlyData.value.data.length === 0) return [];
  
  return hourlyData.value.data
    .filter((item) => item != null)
    .map((item) => {
      const date = item.date ? new Date(item.date) : new Date();
      
      const formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const tds = item.electricConductivity
        ? (item.electricConductivity * 0.65).toFixed(2)
        : null;

      return {
        ...item,
        dateTime: formattedDate,
        timeStamp: date,
        tds: tds ? parseFloat(tds) : 0,
        q: item.discharge || 0,
        qHour: item.totalVolumePerHour || 0,
        qDay: item.totalVolumePerDay || 0,
        pressure: item.pressure || 0,
        temp: item.temperature || "0",
      };
    })
    .sort((a, b) => b.timeStamp - a.timeStamp);
});
const formattedMinuteData = computed(() => {});
const filteredData = computed(() => {
  let data;
  switch (selectedFrequency.value) {
    case 'minute':
      data = storeMinuteData.value?.data || [];
      break;
    case 'hour':
      data = formattedHourlyData.value;
      break;
    case 'day':
      data = stationDataDayStore.data;
      break;
  }

  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    ...item,
    dateTime: new Date(item.date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    timeStamp: new Date(item.date),
    discharge: item.discharge || '-',
    totalVolumePerDay: item.totalVolumePerDay || '-',
    pressure: item.pressure || '-',
    temperature: item.temperature || '-',
    cl: item.cl || '-',
    turbidity: item.turbidity || '-',
    tds: item.electricConductivity ? (item.electricConductivity * 0.65).toFixed(2) : '-'
  }));
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
const selectedParam = ref("q1Hour");
const selectedFrequency = ref('minute');
const stationDataMinuteStore = useStationDataMinuteStore();
const { 
  minuteData: storeMinuteData,
  allMinuteData: storeAllMinuteData,
  loading: minuteLoading, 
  error: minuteError, 
  pagination 
} = storeToRefs(stationDataMinuteStore);
const paginationRows = computed(() => pagination.value?.take || 10);
const totalRecords = computed(() => pagination.value?.total || 0);
const currentPage = computed(() => pagination.value?.currentPage || 0);
const handleFrequencyChange = async () => {
  const stationId = parseInt(route.params.id, 10);
  if (isNaN(stationId)) return;

  switch (selectedFrequency.value) {
    case 'minute':
      await stationDataMinuteStore.fetchMinuteData({
        stationId,
        skip: 0,
        take: 10
      });
      break;
    case 'hour':
      await stationDataHourStore.fetchHourlyData({
        stationId,
        fromDate: fromDate.value,
        toDate: toDate.value,
        skip: 0,
        take: 10
      });
      break;
    case 'day':
      await stationDataDayStore.fetchDailyData({
        stationId,
        fromDate: fromDate.value,
        toDate: toDate.value,
      });
      break;
  }
};
const onPageChange = (event) => {
  const stationId = parseInt(route.params.id, 10);
  const skip = event.first;
  const take = event.rows;

  if (selectedFrequency.value === 'minute') {
    stationDataMinuteStore.fetchMinuteData({
      stationId,
      skip,
      take
    });
  } else if (selectedFrequency.value === 'hour') {
    stationDataHourStore.fetchHourlyData({
      stationId,
      fromDate: fromDate.value,
      toDate: toDate.value,
      skip,
      take
    });
  }
};
const chartData = computed(() => {
  switch (selectedFrequency.value) {
    case 'minute':
      if (!stationDataMinuteStore.allMinuteData?.data || !Array.isArray(stationDataMinuteStore.allMinuteData.data)) return [];
      return stationDataMinuteStore.allMinuteData.data.map(item => ({
        ...item,
        timeStamp: new Date(item.date),
        tds: item.electricConductivity ? (item.electricConductivity * 0.65).toFixed(2) : 0,
        q: item.discharge || 0,
        qHour: item.totalVolumePerHour || 0,
        qDay: item.totalVolumePerDay || 0,
        pressure: item.pressure || 0,
        temp: item.temperature || 0,
      }));
    case 'hour':
      if (!stationDataHourStore.allHourlyData?.data) return [];
      return stationDataHourStore.allHourlyData.data.map(item => ({
        ...item,
        timeStamp: new Date(item.date),
        tds: item.electricConductivity ? (item.electricConductivity * 0.65).toFixed(2) : 0,
      }));
    case 'day':
      return stationDataDayStore.data || [];
    default:
      return [];
  }
});
const frequencyOptions = [
  { label: 'Minute', value: 'minute' },
  { label: 'Hour', value: 'hour' },
  { label: 'Day', value: 'day' }
];
</script>
<style>
.p-datepicker-input {
  @apply !bg-gray-200 text-sm !text-black sm:text-base;
}
.p-select-list {
  @apply !bg-white !text-black;
}
</style>
