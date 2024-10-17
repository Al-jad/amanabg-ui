<template>
  <div class="container mx-auto px-4 py-8">
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
      <div class="mb-8 flex flex-col items-start gap-4">
        <NuxtLink
          to="/data/pipes-water"
          class="flex items-center text-DarkBlue transition-colors duration-300 hover:text-DarkBlue/80"
        >
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to All Stations
        </NuxtLink>
        <div class="flex p-6 py-2 flex-col items-start sm:p-4 sm:py-1 justify-between gap-4 w-full">
          <div class="flex justify-between sm:flex-col sm:gap-4 items-center sm:items-stretch w-full">
            <h1 class="text-xl sm:text-left font-bold text-gray-800">
              {{ stationName || "Station name not found" }}
            </h1>
            <div class="flex items-center sm:flex-col gap-2 sm:gap-4">
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
                  label="OK"
                  class="!border-none !bg-DarkBlue !text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="mb-6 rounded-lg bg-white p-4 pt-0 shadow-lg sm:p-6">
        <p class="mb-2">
          <span class="pr-2">City: </span>
          <span>{{ stationCity || "N/A" }}</span>
        </p>
      </div> -->
      <div class="rounded-lg bg-white p-4 shadow-lg sm:p-4">
        <Table
          :value="filteredData"
          :columns="columns"
          class="w-full"
          :sortField="'date'"
          :sortOrder="1"
          @row-click="onRowClick"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-base text-gray-600 sm:text-lg">No data available</p>
    </div>
    <div>
      <EChart
        :hourlyData="
          dataType === 'Hourly' ? formattedHourlyData : formattedMinuteData
        "
        :includeTDS="true"
        :paramNames="paramNames"
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

// Helper function to get the start of day
const startOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Helper function to get the end of day
const endOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

// Helper function to subtract months from a date
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
};

const columns = computed(() => {
  const baseColumns = [
    { header: "Date", sortable: true, field: "date" },
    { header: "Time", sortable: true, field: "time" },
    {
      header: "Q ( Hour )",
      sortable: true,
      field: "totalVolumePerHour",
      unit: "m³/h",
    },
    {
      header: "Q ( Day )",
      sortable: true,
      field: "totalVolumePerDay",
      unit: "m³/d",
    },
    { header: "P", sortable: true, field: "pressure", unit: "Bar" },
    { header: "Cl⁺", sortable: true, field: "cl", unit: "mg/L" },
    { header: "Turb", sortable: true, field: "turbidity", unit: "NTU" },
    {
      header: "TDS",
      sortable: true,
      field: "tds",
      unit: "ppm",
    },
  ];

  return baseColumns.map((column) => ({
    ...column,
    class:
      "!bg-DarkBlue !outline !outline-1 !outline-white !text-white font-semibold py-1 sm:py-2",
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
  fetchData(); // Refetch data with reset dates
};

const resetToHourlyData = () => {
  dataType.value = "Hourly";
  minuteDate.value = null;
  minuteDateError.value = "";
};

const formattedHourlyData = computed(() => {
  if (!hourlyData.value) return [];

  return hourlyData.value
    .map((item) => {
      const date = new Date(item.timeStamp);
      const tds = (item.electricConductivity * 0.65).toFixed(2); // Updated TDS calculation
      return {
        ...item,
        date: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tds: parseFloat(tds),
        qHour: item.totalVolumePerHour,
        qDay: item.totalVolumePerDay,
        timeStamp: date,
      };
    })
    .sort((a, b) => a.timeStamp - b.timeStamp);
});

const formattedMinuteData = computed(() => {
  // Similar to formattedHourlyData, but for minute data if available
  // If you don't have minute data, you can remove this computed property
});

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
  const formattedDate = clickedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const minuteDataUrl = `/data/details/perMinute/${route.params.id}?date=${formattedDate}&stationName=${encodeURIComponent(stationName.value)}`;

  // Open in a new tab
  window.open(minuteDataUrl, "_blank");
};
</script>

<style>
.p-datepicker-input {
  @apply !bg-gray-200 text-sm !text-black sm:text-base;
}
</style>
