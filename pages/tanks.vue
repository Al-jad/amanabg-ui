<template>
  <!-- Main container with responsive padding -->
  <div class="container px-4 py-8 mx-auto sm:px-4 lg:px-8">
    <div class="p-4 bg-white shadow sm:rounded-lg">
      <!-- Header section with back button, title, and view selector -->
      <div class="flex flex-col mb-8 sm:flex-col md:flex-row md:items-center md:justify-between">
        <!-- Back button and title -->
        <div class="flex mb-4 text-nowrap md:mb-0">
          <div class="flex flex-col items-start gap-4 mb-8">
            <NuxtLink to="/" class="flex items-center transition-colors duration-300 text-DarkBlue hover:text-DarkBlue/80">
              <Icon name="mdi:arrow-left" class="mr-2" />
              Back
            </NuxtLink>
            <Icon name="mdi:water-tank" class="mr-2 text-2xl text-blue-500 sm:text-xl" />
            <h1 class="text-xl font-bold text-black sm:text-lg">Water Tanks Monitoring</h1>
          </div>
        </div>
        <!-- View selector (Table/Map) -->
        <div class="flex justify-center sm:overflow-hidden">
          <SelectButton v-model="selectedView" :options="viewOptions" @change="handleViewChange">
            <template #option="slotProps">
              <div class="flex items-center">
                <Icon :name="slotProps.option === 'Table' ? 'mdi:table' : 'mdi:map'" class="mr-2" />
                {{ slotProps.option }}
              </div>
            </template>
          </SelectButton>
        </div>
      </div>

      <!-- City filter dropdown -->
      <div class="flex items-center gap-4 mb-4">
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

      <!-- Table view -->
      <div v-if="selectedView === 'Table'">
        <!-- Render table if data is available -->
        <Table
          v-if="!loading && filteredTanksData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="formattedFilteredTanksData"
          @row-click="onRowClick"
          :current-page-report="false"
        >
          <template #body="slotProps">
            <Row v-for="col in columns" :key="col.field">
              <template v-if="col.field === 'level'">
                <span :class="getTankLevelColor(slotProps.data[col.field])">
                  {{ slotProps.data[col.field] }}
                  <span v-html="getTankLevelArrow(slotProps.data[col.field])"></span>
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
      </div>

      <!-- Map view -->
      <div v-else-if="selectedView === 'Map'">
        <Map :stations="filteredMapStations" />
        <!-- No tanks available message -->
        <div
          v-if="filteredMapStations.length === 0"
          class="mt-4 text-center text-gray-500"
        >
          No tanks available for map view
        </div>
      </div>

      <!-- Legend for tank data -->
      <br />
      <div class="text-sm">
        <p>Level = Water level in the tank</p>
        <p>Capacity = Total capacity of the tank</p>
        <p>Inflow = Rate of water flowing into the tank</p>
        <p>Outflow = Rate of water flowing out of the tank</p>
        <p>Chlorine = Chlorine level in the tank</p>
        <p>Turb. = Turbidity of water in the tank</p>
        <p>EC = Electrical conductivity of water in the tank</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const router = useRouter();

// View options and selected view state
const viewOptions = ref(['Table', 'Map']);
const selectedView = ref('Table');

// City filter state
const selectedCity = ref('All');
const cities = ref(['Baghdad', 'Mosul', 'Basra', 'Erbil']);

// Computed property to include 'All' option in cities list
const citiesWithAll = computed(() => ['All', ...cities.value]);

// Handle row click in the table view
const onRowClick = (event) => {
  const { data } = event;
  if (!data?.tankId || !data.tankCity || !data.tankName) {
    console.error("Invalid event or missing required tank data");
    return;
  }

  nextTick(() => {
    localStorage.setItem("tankCity", data.tankCity);
    localStorage.setItem("tankName", data.tankName);
    router.push({ path: `/data/tank-details/${parseInt(data.tankId, 10)}` });
  });
};

// Table headers and columns configuration
const headers = [
  {
    text: "Tank Info",
    colspan: 3,
    class: "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
  {
    text: "Last Measurement",
    colspan: 9,
    class: "!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white",
  },
];

const columns = [
  { header: "ID", sortable: true, field: "tankId" },
  { header: "Name", sortable: true, field: "tankName" },
  { header: "City", sortable: true, field: "tankCity" },
  { header: "Date", sortable: true, field: "date" },
  { header: "Time", sortable: true, field: "time" },
  { header: "Level", sortable: true, field: "level" },
  { header: "Capacity", sortable: true, field: "capacity" },
  { header: "Inflow", sortable: true, field: "inflow" },
  { header: "Outflow", sortable: true, field: "outflow" },
  { header: "CL", sortable: true, field: "cl" },
  { header: "Turb.", sortable: true, field: "turbidity" },
  { header: "EC", sortable: true, field: "electricConductivity" },
].map(column => ({
  ...column,
  class: "!bg-DarkBlue !outline !outline-1 !outline-white !text-white",
}));

// Sample tank data (replace with actual data fetching logic)
const tanksData = ref([
  {
    tankId: 1,
    tank: { name: "Tank 1", city: "Baghdad", lat: 33.3152, lng: 44.3661 },
    timeStamp: "2023-04-15T10:30:00",
    level: 75,
    capacity: 1000,
    inflow: 50,
    outflow: 45,
    cl: 0.5,
    turbidity: 0.3,
    electricConductivity: 350
  },
  {
    tankId: 2,
    tank: { name: "Tank 2", city: "Mosul", lat: 36.3350, lng: 43.1189 },
    timeStamp: "2023-04-15T10:35:00",
    level: 60,
    capacity: 800,
    inflow: 40,
    outflow: 35,
    cl: 0.6,
    turbidity: 0.4,
    electricConductivity: 380
  },
  // Add more static data as needed
]);

// Filter tanks data based on selected city
const filteredTanksData = computed(() => {
  if (!selectedCity.value || selectedCity.value === 'All') return tanksData.value;
  return tanksData.value.filter(item => item.tank.city === selectedCity.value);
});

// Format filtered tanks data for display
const formattedFilteredTanksData = computed(() => {
  return filteredTanksData.value.map(item => {
    const date = new Date(item.timeStamp);
    return {
      ...item,
      tankName: item.tank.name,
      tankCity: item.tank.city,
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      timeStamp: date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  });
});

// Filter map stations to only include tanks with valid coordinates
const filteredMapStations = computed(() => {
  return filteredTanksData.value.filter(
    (tank) => tank.tank && tank.tank.lat && tank.tank.lng
  );
});

const loading = ref(false);

// Determine color for tank level display
const getTankLevelColor = (level) => {
  const minLevel = 50; // Assuming 50% as the minimum safe level
  return level < minLevel ? 'text-red-500' : 'text-green-500';
};

// Determine arrow direction for tank level display
const getTankLevelArrow = (level) => {
  const minLevel = 50; // Assuming 50% as the minimum safe level
  return level < minLevel ? '&darr;' : '&uarr;';
};

// Placeholder functions for view change and city filtering
const handleViewChange = () => {
  // Add any specific logic for view change if needed
};

const filterByCity = () => {
  // Add any specific logic for city filtering if needed
};
</script>

<style>
/* Custom styles for UI components */
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
