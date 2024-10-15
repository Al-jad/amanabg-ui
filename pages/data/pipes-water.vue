<template>
  <div class="container mx-auto px-4 py-8 sm:px-4 lg:px-8">
    <div class="bg-white p-4 shadow sm:rounded-lg">
      <div
        class="mb-8 flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between"
      >
        <div class="mb-4 flex text-nowrap md:mb-0">
          <div class="mb-8 flex flex-col items-start gap-4">
            <NuxtLink
              to="/"
              class="flex items-center text-DarkBlue transition-colors duration-300 hover:text-DarkBlue/80"
            >
              <Icon name="mdi:arrow-left" class="mr-2" />
              Back
            </NuxtLink>
            <div class="flex items-center gap-2">
              <Icon
                name="fluent:water-16-filled"
                class="mr-2 text-2xl text-blue-500 sm:text-xl"
              />
              <h1 class="text-xl font-bold text-black sm:text-lg">
                Discharge Monitoring Stations
              </h1>
            </div>
          </div>
        </div>
        <div class="flex justify-center sm:overflow-hidden">
          <SelectButton
            v-model="selectedView"
            :options="viewOptions"
            @change="handleViewChange"
          >
            <template #option="slotProps">
              <div class="flex items-center">
                <Icon
                  :name="slotProps.option === 'Table' ? 'mdi:table' : 'mdi:map'"
                  class="mr-2"
                />
                {{ slotProps.option }}
              </div>
            </template>
          </SelectButton>
        </div>
      </div>
      <!-- <div class="mb-4 flex items-center gap-4">
        <h1>Filter by City:</h1>
        <Select
          v-model="selectedCity"
          :options="citiesWithAll"
          placeholder="Select a city"
          aria-labelledby="City selection"
          @change="filterByCity"
          class="!bg-DarkBlue !text-white"
        />
      </div> -->
      <div v-if="selectedView === 'Table'">
        <Table
          v-if="!loading && filteredPipesData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="formattedFilteredPipesData"
          @row-click="onRowClick"
        >
          <template #body="slotProps">
            <Row v-for="col in columns" :key="col.field">
              <template v-if="col.field === 'discharge'">
                <span :class="getDischargeColor(slotProps.data[col.field])">
                  {{ slotProps.data[col.field] }}
                  <span
                    v-html="getDischargeArrow(slotProps.data[col.field])"
                  ></span>
                </span>
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </Row>
          </template>
        </Table>
        <div v-else-if="loading" class="flex items-center justify-center">
          <p class="text-gray-500">Loading data...</p>
          <span class="ml-2 animate-spin">&#8987;</span>
        </div>
        <div v-else class="flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
        </div>
        <div class="mt-4 text-sm">
          <p>Q (m³/min) = pipe discharge in the last minute</p>
          <p>Q (m³/h) = pipe discharge in the last hour</p>
          <p>Q (m³/d) = pipe discharge in the last day</p>
          <p>P = Pressure of water in the pipe</p>
          <p>cL⁺ = Chlorine level in the pipe</p>
          <p>Turb. = Turbidity of water in the pipe</p>
          <p>TDS = Total Dissolved Solids in the pipe</p>
        </div>
      </div>
      <div v-else-if="selectedView === 'Map'">
        <Map :stations="filteredMapStations" />
        <div
          v-if="filteredMapStations.length === 0"
          class="mt-4 text-center text-gray-500"
        >
          No stations available for map view
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const viewOptions = ref(["Table", "Map"]);
const selectedView = ref("Table");

const selectedCity = ref("All");
const cities = ref([]);

const citiesWithAll = computed(() => ["All", ...cities.value]);

const onRowClick = (event) => {
  const { data } = event;
  if (!data?.stationId || !data.station?.city || !data.station?.name) {
    console.error("Invalid event or missing required station data");
    return;
  }

  const {
    stationId: stationId,
    station: { city: stationCity, name: stationName },
  } = data;

  nextTick(() => {
    localStorage.setItem("stationCity", stationCity);
    localStorage.setItem("stationName", stationName);
    router.push({ path: `/data/details/${parseInt(stationId, 10)}` });
  });
};

const headers = [
  {
    text: "Station Info",
    colspan: 3,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  {
    text: "Last Measurement",
    colspan: 9,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
];

const columns = [
  { header: "ID", sortable: false, field: "stationId" },
  { header: "Project Name", sortable: false, field: "stationName" },
  // { header: "City", sortable: false, field: "stationCity" },
  { header: "Date", sortable: true, field: "date" },
  { header: "Time", sortable: true, field: "time" },
  { header: "Q", sortable: true, field: "discharge", unit: "m³/min" },
  { header: "Q", sortable: true, field: "totalVolumePerHour", unit: "m³/h" },
  { header: "Q", sortable: true, field: "totalVolumePerDay", unit: "m³/d" },
  { header: "P", sortable: true, field: "pressure", unit: "Bar" },
  { header: "cl", sortable: true, field: "cl", unit: "mg/L" },
  { header: "Turb", sortable: true, field: "turbidity", unit: "NTU" },
  { header: "TDS", sortable: true, field: "tds", unit: "mg/L" },
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white",
}));

const stationStore = useStationStore();

const pipesData = computed(() => {
  const storePipesData = stationStore.pipesData;
  return Array.isArray(storePipesData) ? storePipesData : [storePipesData];
});

const extractCities = () => {
  const uniqueCities = new Set(
    pipesData.value.map((item) => item.station.city),
  );
  cities.value = Array.from(uniqueCities);
};

const filteredPipesData = computed(() => {
  if (!selectedCity.value || selectedCity.value === "All")
    return pipesData.value;
  return pipesData.value.filter(
    (item) => item.station.city === selectedCity.value,
  );
});

const formattedFilteredPipesData = computed(() => {
  return filteredPipesData.value.map((item) => {
    const date = new Date(item?.timeStamp);
    // Convert EC to TDS using the correct formula
    const tds = (item?.electricConductivity * 0.65).toFixed(2);
    return {
      ...item,
      stationName: item?.station?.name,
      stationCity: item?.station?.city,
      date: date.toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      timeStamp: date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      tds: tds,
    };
  });
});

const filteredMapStations = computed(() => {
  return filteredPipesData.value.filter((item) => {
    return (
      item &&
      item.station &&
      typeof item.station === "object" &&
      "lat" in item.station &&
      "lng" in item.station &&
      item.station.lat !== null &&
      item.station.lng !== null
    );
  });
});

const dataSource = ref("API");
const lastUpdated = ref(null);
const loading = ref(true);

const filterByCity = () => {};

const fetchInitialData = async () => {
  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    const { data } = await $axios.get("/Pipes/latest_data");
    stationStore.setPipesData(data);
    lastUpdated.value = new Date().toLocaleString();
    extractCities();
  } catch (error) {
    console.error("Error fetching initial data:", error);
  } finally {
    loading.value = false;
  }
};
watch(
  () => stationStore.pipesData,
  (newValue) => {
    if (newValue) {
      lastUpdated.value = new Date().toLocaleString();
      if (stationStore.connection && stationStore.connection.state === 1) {
        dataSource.value = "WebSocket";
      }
      loading.value = false;
      extractCities();
    }
  },
  { deep: true },
);

const handleViewChange = () => {
  // Add any logic needed when view changes
};

const initializeComponent = async () => {
  const view = route.query.view?.toLowerCase();
  if (view === "map") {
    selectedView.value = "Map";
  }
  await fetchInitialData();
  stationStore.connect();
};

onMounted(initializeComponent);

const getDischargeColor = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "text-red-500" : "text-green-500";
};

const getDischargeArrow = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "&darr" : "&uarr;";
};

const hourlyChartData = ref([]);
const paramNames = ref({
  discharge: { full: "Discharge", short: "Q" },
  totalVolumePerHour: { full: "Hourly Volume", short: "Q (h)" },
  totalVolumePerDay: { full: "Daily Volume", short: "Q (d)" },
  pressure: { full: "Pressure", short: "P" },
  cl: { full: "Chlorine", short: "Cl" },
  turbidity: { full: "Turbidity", short: "Turb" },
  electricConductivity: { full: "TDS", short: "TDS" },
});
const units = ref({
  discharge: "m³/min",
  totalVolumePerHour: "m³/h",
  totalVolumePerDay: "m³/d",
  pressure: "Bar",
  cl: "mg/L",
  turbidity: "NTU",
  electricConductivity: "mg/L",
});
const selectedParam = ref("discharge");

const formattedHourlyChartData = computed(() => {
  return hourlyChartData.value
    .map((item) => {
      if (!item) return null;
      return {
        timeStamp: new Date(item.timeStamp),
        discharge: item.discharge || null,
        totalVolumePerHour: item.totalVolumePerHour || null,
        totalVolumePerDay: item.totalVolumePerDay || null,
        pressure: item.pressure || null,
        cl: item.cl || null,
        turbidity: item.turbidity || null,
        electricConductivity: item.electricConductivity
          ? Number((item.electricConductivity * 0.65).toFixed(2))
          : null,
      };
    })
    .filter((item) => item !== null);
});

// Fetch hourly data for the chart
const fetchHourlyData = async () => {
  try {
    const { $axios } = useNuxtApp();
    const { data } = await $axios.get("/Pipes/hourly_data");
    hourlyChartData.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching hourly data:", error);
    hourlyChartData.value = [];
  }
};

onMounted(async () => {
  await fetchHourlyData();
  await initializeComponent();
});

// ... (rest of the existing code)
</script>

<style>
.p-togglebutton {
  @apply !bg-DarkBlue !text-white;
}
.p-togglebutton-checked::before {
  @apply !bg-DarkBlue !text-white;
}
.p-togglebutton-checked {
  @apply !bg-DarkBlue/70 !text-white;
}
.p-select {
  @apply !text-white;
}
</style>
