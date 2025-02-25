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
              <Icon
                name="mdi:arrow-left"
                class="mr-2"
              />
              Back
            </NuxtLink>
            <Icon
              name="mdi:water-tank"
              class="mr-2 text-2xl text-blue-500 sm:text-xl"
            />
            <h1 class="text-xl font-bold text-black sm:text-lg">
              Water Tanks Monitoring
            </h1>
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
      <div
        v-if="selectedView === 'Table'"
        class="mb-12"
      >
        <Table
          v-if="!loading && filteredTanksData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="formattedFilteredTanksData"
          @row-click="onRowClick"
          :current-page-report="false"
        >
          <template #body="slotProps">
            <Row
              v-for="col in columns"
              :key="col.field"
            >
              <template v-if="col.field === 'level'">
                <span :class="getTankLevelColor(slotProps.data[col.field])">
                  {{ slotProps.data[col.field] }}
                  <span
                    v-html="getTankLevelArrow(slotProps.data[col.field])"
                  ></span>
                </span>
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </Row>
          </template>
        </Table>
        <div
          v-else-if="loading"
          class="flex items-center justify-center"
        >
          <p class="text-gray-500">Loading data...</p>
          <span class="ml-2 animate-spin">&#8987;</span>
        </div>
        <div
          v-else
          class="flex items-center justify-center"
        >
          <p class="text-gray-500">No data available</p>
        </div>
      </div>
      <div v-else-if="selectedView === 'Map'">
        <Map :stations="filteredMapStations" />
        <div
          v-if="filteredMapStations.length === 0"
          class="mt-4 text-center text-gray-500"
        >
          No tanks available for map view
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  const router = useRouter();
  const { $axios } = useNuxtApp();
  const viewOptions = ref(['Table', 'Map']);
  const selectedView = ref('Table');
  const onRowClick = (event) => {
    const { data } = event;
    if (!data?.tankId) {
      console.error('Invalid event or missing required tank data');
      return;
    }

    nextTick(() => {
      // Store additional data needed for the details page
      localStorage.setItem('stationName', data.tankName);
      localStorage.setItem('stationType', '1'); // 1 for tanks

      // Navigate to the details page
      router.push({
        path: `/data/details/${data.tankId}`,
      });
    });
  };
  const headers = [
    {
      text: 'Tank Info',
      colspan: 2,
      class:
        '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
    },
    {
      text: 'Last Measurement',
      colspan: 4,
      class:
        '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
    },
  ];
  const columns = [
    { header: 'ID', sortable: true, field: 'tankId' },
    { header: 'Name', sortable: true, field: 'tankName' },
    { header: 'Date & Time', sortable: true, field: 'date' },
    { header: 'WL (m)', sortable: true, field: 'level' },
    { header: 'WL %', sortable: true, field: 'waterLevelPercentage' },
    { header: 'Total Volume (m³)', sortable: true, field: 'totalVolume' },
  ].map((column) => ({
    ...column,
    class: '!bg-DarkBlue !outline !outline-1 !outline-white !text-white',
  }));
  const tanksData = ref([]);
  const loading = ref(true);
  const fetchTanksData = async () => {
    try {
      loading.value = true;
      const response = await $axios.get('/Pipes/latest_data');
      tanksData.value = response.data
        .filter((item) => item.station?.stationType === 1)
        .map((item) => ({
          tankId: item.stationId,
          tank: {
            name: item.station.name,
          },
          timeStamp: item.timeStamp,
          level: item.waterLevel?.toFixed(2) || 0,
          currentVolume: item.currentVolume?.toFixed(2) || 0,
        }));
    } catch (error) {
      console.error('Error fetching tanks data:', error);
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    fetchTanksData();
  });
  const filteredTanksData = computed(() => {
    return tanksData.value || [];
  });
  const formattedFilteredTanksData = computed(() => {
    return filteredTanksData.value.map((item) => {
      const date = new Date(item.timeStamp);
      const waterLevel = Number(item.level) || 0;
      const waterLevelPercentage = ((waterLevel / 6) * 100).toFixed(2);
      const totalVolume = (waterLevel * 170 * 250).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return {
        ...item,
        tankName: item.tank.name,
        date: date.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        level: waterLevel.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        waterLevelPercentage: `${waterLevelPercentage}%`,
        totalVolume: totalVolume,
      };
    });
  });
  const filteredMapStations = computed(() => {
    return filteredTanksData.value.filter(
      (tank) => tank.tank && tank.tank.lat && tank.tank.lng
    );
  });
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
