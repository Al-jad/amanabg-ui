<template>
  <!-- Main container -->
  <div class="container px-4 py-8 mx-auto sm:px-4 lg:px-8">
    <div class="p-4 pb-0 bg-white shadow sm:rounded-lg">
      <!-- Header section with back button, title, and view selector -->
      <div class="flex flex-col mb-8 sm:flex-col md:flex-row md:items-center md:justify-between">
        <!-- Back button and title -->
        <div class="flex mb-4 text-nowrap sm:mb-0">
          <div class="flex flex-col items-start gap-4 mb-8">
            <NuxtLink
              to="/"
              class="flex items-center transition-colors duration-300 text-DarkBlue hover:text-DarkBlue/80"
            >
              <Icon name="mdi:arrow-left" class="mr-2" />
              Back
            </NuxtLink>
            <div class="flex items-center gap-2">
              <Icon
                name="fluent:water-16-filled"
                class="mr-2 text-2xl text-blue-500"
              />
              <h1 class="text-xl font-bold text-black sm:text-lg">
                Discharge Monitoring Stations
              </h1>
            </div>
          </div>
        </div>
        <!-- View selector (Table/Map) -->
        <div class="flex justify-center">
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
      
      <!-- Table view -->
      <div v-if="selectedView === 'Table'">
        <!-- Render table if data is available -->
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
        <!-- Loading indicator -->
        <div v-else-if="loading" class="flex items-center justify-center">
          <p class="text-gray-500">Loading data...</p>
          <span class="ml-2 animate-spin">&#8987;</span>
        </div>
        <!-- No data message -->
        <div v-else class="flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
        </div>
        <!-- Legend for table data -->
        <div class="py-4 text-sm">
          <p>* Q ( m³/min ) = total discharge in the last minute</p>
          <p>* Q ( m³/h ) = total discharge in the last hour</p>
          <p>* Q ( m³/d ) = total discharge in the last day</p>
          <p>* P ( Bar ) = Water Pressure in the pipe</p>
          <p>* Cl⁺ ( mg/L ) = Chlorine level in the pipe</p>
          <p>* Turb. ( NTU ) = Turbidity of water in the pipe</p>
          <p>* TDS ( ppm ) = Total Dissolved Solids in the pipe</p>
        </div>
      </div>
      
      <!-- Map view -->
      <div v-else-if="selectedView === 'Map'">
        <Map :stations="filteredMapStations" />
        <!-- No stations message for map view -->
        <div v-if="filteredMapStations.length === 0" class="mt-4 text-center text-gray-500">
          No stations available for map view
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

// Define view options and selected view
const viewOptions = ref(["Table", "Map"]);
const selectedView = ref("Table");

// City selection (currently commented out)
const selectedCity = ref("All");
const cities = ref([]);

const citiesWithAll = computed(() => ["All", ...cities.value]);

// Handle row click in the table
const onRowClick = (event) => {
  const { data } = event;
  if (!data?.stationId || !data.station?.name) {
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

// Define table headers and columns
const headers = [
  {
    text: "Station Info",
    colspan: 2,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  {
    text: "Last Measurement",
    colspan: 10,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  // {
  //   text: "Connection",
  //   colspan: 1,
  //   class:
  //     "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  // }
];

const columns = [
  { header: "ID", sortable: false, field: "stationId" },
  { header: "Project Name", sortable: false, field: "stationName" },
  // { header: "City", sortable: false, field: "stationCity" },
  {
    header: "Status",
    sortable: false,
    field: "status",
  },
  { header: "Date", sortable: true, field: "date" },
  { header: "Time", sortable: true, field: "time" },
  { header: "Q1 ( Minute ) *", sortable: true, field: "discharge", unit: "m³/min" },
  { header: "Q2 ( Minute ) *", sortable: true, field: "discharge2", unit: "m³/min" },
  { header: "Q ( Hour ) *", sortable: true, field: "totalVolumePerHour", unit: "m³/h" },
  { header: "Q ( Day ) *", sortable: true, field: "totalVolumePerDay", unit: "m³/d" },
  { header: "P1 *", sortable: true, field: "pressure", unit: "Bar" },
  { header: "P2 *", sortable: true, field: "pressure2", unit: "Bar" },
  { header: "Temp", sortable: true, field: "temperature", unit: "C"},
  { header: "Cl⁺ *", sortable: true, field: "cl", unit: "mg/L" },
  { header: "Turb *", sortable: true, field: "turbidity", unit: "NTU" },
  { header: "TDS *", sortable: true, field: "tds", unit: "ppm" },
  // { header: "Operating Time", sortable: true, field: "operatingTime" },
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue !outline !outline-1 !outline-white !text-white",
}));

// Use station store for data management
const stationStore = useStationStore();

// Compute pipes data from store
const pipesData = computed(() => {
  const storePipesData = stationStore.pipesData;
  return Array.isArray(storePipesData) ? storePipesData : [storePipesData];
});

// Extract unique cities from pipes data (currently commented out)
const extractCities = () => {
  // const uniqueCities = new Set(
  //   pipesData.value.map((item) => item.station.city),
  // );
  // cities.value = Array.from(uniqueCities);
};

// Filter pipes data based on selected city
const filteredPipesData = computed(() => {
  if (!selectedCity.value || selectedCity.value === "All")
    return pipesData.value;
  return pipesData.value.filter(
    (item) => item.station.city === selectedCity.value,
  );
});

// Format filtered pipes data for display
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

// Filter stations for map view
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

// Data source and loading state
const dataSource = ref("API");
const lastUpdated = ref(null);
const loading = ref(true);

// City filter function (currently empty)
const filterByCity = () => {};

// Fetch initial data from API
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

// Watch for changes in pipes data
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

// Handle view change (currently empty)
const handleViewChange = () => {
  // Add any logic needed when view changes
};

// Initialize component
const initializeComponent = async () => {
  const view = route.query.view?.toLowerCase();
  if (view === "map") {
    selectedView.value = "Map";
  }
  await fetchInitialData();
  stationStore.connect();
};

// Run initialization on component mount
onMounted(initializeComponent);

// Helper functions for discharge display
const getDischargeColor = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "text-red-500" : "text-green-500";
};

const getDischargeArrow = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "&darr" : "&uarr;";
};

// Chart data and parameters (not currently used in the template)
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

// Format hourly chart data
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
    const { data } = await $axios.get("/Pipes/hourly");
    hourlyChartData.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching hourly data:", error);
    hourlyChartData.value = [];
  }
};

// Fetch hourly data and initialize component on mount
onMounted(async () => {
  await fetchHourlyData();
  await initializeComponent();
});
</script>

<style>
/* Custom styles for PrimeVue components */
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
