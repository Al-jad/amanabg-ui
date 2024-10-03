<template>
  <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div class="bg-white p-8 shadow sm:rounded-lg">
      <div class="flex items-center justify-between">
        <h1
          class="mb-6 text-left text-3xl font-bold text-gray-900 sm:mx-[10%] sm:text-2xl"
        >
          Discharge Monitoring Stations
        </h1>
        <SelectButton
          v-model="selectedView"
          :options="viewOptions"
          class="p-button-sm "
        />
      </div>
      <div class="mb-4 flex items-center gap-4">
        <h1>Filter by City:</h1>
        <Select
          v-model="selectedCity"
          :options="citiesWithAll"
          placeholder="Select a city"
          aria-labelledby="City selection"
          @change="filterByCity"
          class="!bg-DarkBlue !text-white"
        />
      </div>
      <div v-if="selectedView === 'Table'">
        <Table
          v-if="!loading && filteredPipesData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="formattedFilteredPipesData"
          @row-click="onRowClick"
        >
          <template #body="slotProps">
            <TableCell v-for="col in columns" :key="col.field">
              <template v-if="col.field === 'discharge'">
                <span :class="getDischargeColor(slotProps.data[col.field])">
                  {{ slotProps.data[col.field] }}
                  <span v-html="getDischargeArrow(slotProps.data[col.field])"></span>
                </span>
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </TableCell>
          </template>
        </Table>
        <div v-else-if="loading" class="flex items-center justify-center">
          <p class="text-gray-500">Loading data...</p>
          <span class="ml-2 animate-spin">&#8987;</span>
        </div>
        <div v-else class="flex items-center justify-center">
          <p class="text-gray-500">No data available</p>
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
      <div class="text-sm">
        <p>
          Q (m3/m) = Flow rate of water in the pipe (discharge)
        </p>
        <p>
          Q (m3/h) = Flow rate of water in the pipe (discharge)
        </p>
        <p>
          Q (m3/d) = Flow rate of water in the pipe (discharge)
        </p>
        <p>Pressure = Pressure of water in the pipe</p>
        <p>Chlorine = Chlorine level in the pipe</p>
        <p>Turb. = Turbidity of water in the pipe</p>
        <p>EC = Electrical conductivity of water in the pipe</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const viewOptions = ref(['Table', 'Map']);
const selectedView = ref('Table');

const selectedCity = ref('All');
const cities = ref([]);

const citiesWithAll = computed(() => ['All', ...cities.value]);

const onRowClick = (event) => {
  const { data } = event;
  if (!data?.stationId || !data.station?.city || !data.station?.name) {
    console.error("Invalid event or missing required station data");
    return;
  }

  const { stationId: stationId, station: { city: stationCity, name: stationName } } = data;

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
  { header: "ID", sortable: true, field: "stationId" },
  { header: "Name", sortable: true, field: "stationName" },
  { header: "City", sortable: true, field: "stationCity" },
  { header: "Date", sortable: true, field: "date" },
  { header: "Time", sortable: true, field: "time" },
  { header: "Q m3 / m", sortable: true, field: "discharge" },
  { header: "Q m3 / h", sortable: true, field: "totalVolumePerHour" },
  { header: "Q m3 / d", sortable: true, field: "totalVolumePerDay" },
  { header: "P", sortable: true, field: "pressure" },
  { header: "CL", sortable: true, field: "cl" },
  { header: "Turb.", sortable: true, field: "turbidity" },
  { header: "EC", sortable: true, field: "electricConductivity" },
].map(column => ({
  ...column,
  class: "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white",
}));

const stationStore = useStationStore();

const pipesData = computed(() => {
  const storePipesData = stationStore.pipesData;
  return Array.isArray(storePipesData) ? storePipesData : [storePipesData];
});

const extractCities = () => {
  const uniqueCities = new Set(pipesData.value.map(item => item.station.city));
  cities.value = Array.from(uniqueCities);
};

const filteredPipesData = computed(() => {
  if (!selectedCity.value || selectedCity.value === 'All') return pipesData.value;
  return pipesData.value.filter(item => item.station.city === selectedCity.value);
});

const formattedFilteredPipesData = computed(() => {
  return filteredPipesData.value.map(item => {
    const date = new Date(item.timeStamp);
    return {
      ...item,
      stationName: item.station.name,
      stationCity: item.station.city,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeStamp: date.toLocaleString()
    };
  });
});

const filteredMapStations = computed(() => {
  return filteredPipesData.value.filter(
    (station) => station.station && station.station.lat && station.station.lng
  );
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
  { deep: true }
);

onMounted(async () => {
  await fetchInitialData();
  stationStore.connect();
});

const getDischargeColor = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? 'text-red-500' : 'text-green-500';
};

const getDischargeArrow = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? '&darr' : '&uarr;';
};
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

</style>