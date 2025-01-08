<template>
  <div class="container px-4 py-8 mx-auto sm:px-4 lg:px-8">
    <div class="p-4 pb-0 bg-white shadow sm:rounded-lg">
      <div class="flex flex-col mb-8 sm:flex-col md:flex-row md:items-center md:justify-between">
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
      <div v-if="selectedView === 'Table'">
        <Table
          v-if="!loading && filteredPipesData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="loading ? Array(10).fill({}) : formattedFilteredPipesData"
          :loading="loading"
          @row-click="onRowClick"
        >
          <template #loading>
            <tr v-for="i in 10" :key="i">
              <td v-for="col in columns" :key="col.field" class="p-3">
                <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          </template>
        </Table>
        <div v-else-if="loading" class="flex items-center justify-center p-4">
          <div class="w-full">
            <div v-for="i in 5" :key="i" class="mb-4">
              <div class="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
        </div>
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
      
      <div v-else-if="selectedView === 'Map'">
        <Map :stations="filteredMapStations" />
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

const viewOptions = ref(["Table", "Map"]);
const selectedView = ref("Table");

const selectedCity = ref("All");
const cities = ref([]);

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

const headers = [
  {
    text: "Station Info",
    colspan: 3,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  {
    text: "Last Measurement",
    colspan: 10,
    class:
      "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
];

const columns = [
  {
    header: "Status",
    sortable: false,
    field: "status",
  },
  { header: "ID", sortable: false, field: "stationId" },
  { header: "Project Name", sortable: false, field: "stationName" },
  { header: "Date Time", sortable: true, field: "timeStamp" },
  { header: "Q *", sortable: true, field: "dischargeInMinute", unit: "m³/min" },
  { header: "Q *", sortable: true, field: "dischargeInHour", unit: "m³/h" },
  { header: "Q *", sortable: true, field: "dischargeInDay", unit: "m³/d" },
  { header: "P *", sortable: true, field: "pressure", unit: "m" },
  { header: "Water Level", sortable: true, field: "waterLevel", unit: "m" },
  { header: "Water Quality", sortable: true, field: "waterQuality", unit: "m" },
  { header: "Temp", sortable: true, field: "temperature", unit: "C"},
  { header: "Cl⁺ *", sortable: true, field: "cl", unit: "mg/L" },
  { header: "Turb *", sortable: true, field: "turbidity", unit: "NTU" },
  { header: "TDS *", sortable: true, field: "tds", unit: "ppm" },
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue !outline !outline-1 !outline-white !text-white",
}));

const stationStore = useStationStore();

const pipesData = computed(() => {
  const storePipesData = stationStore.pipesData;
  return Array.isArray(storePipesData) ? storePipesData : [storePipesData];
});

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
    const tds = item?.electricConductivity != null 
      ? (item.electricConductivity * 0.65).toFixed(2) 
      : '0.00';
    return {
      ...item,
      stationName: item?.station?.name,
      stationCity: item?.station?.city,
      timeStamp: date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
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

const fetchInitialData = async () => {
  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    const { data } = await $axios.get("/Pipes/latest_data");
    stationStore.setPipesData(data);
    lastUpdated.value = new Date().toLocaleString();
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
    }
  },
  { deep: true },
);

const initializeComponent = async () => {
  const view = route.query.view?.toLowerCase();
  if (view === "map") {
    selectedView.value = "Map";
  }
  await fetchInitialData();
  stationStore.connect();
};

onMounted(async () => {
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
