<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 sm:px-2 lg:px-8">
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <!-- Header Section -->
        <div
          class="mb-8 flex flex-col gap-6 sm:flex-col md:flex-row md:items-center md:justify-between"
        >
          <!-- Left Side -->
          <div class="flex flex-col items-start gap-4">
            <NuxtLink
              to="/"
              class="group flex items-center text-DarkBlue transition-all duration-300 hover:translate-x-[-0.25rem]"
            >
              <Icon
                name="mdi:arrow-left"
                class="mr-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span class="font-medium">Back to Dashboard</span>
            </NuxtLink>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-50 p-2">
                <Icon
                  name="mdi:water-tank"
                  class="text-2xl text-blue-600"
                />
              </div>
              <h1 class="text-2xl font-bold text-gray-900">
                Water Tanks Monitoring
              </h1>
            </div>
          </div>
          <!-- Right Side -->
          <div class="flex items-center justify-center">
            <SelectButton
              v-model="selectedView"
              :options="viewOptions"
              :pt="{
                root: { class: '!shadow-md' },
                button: { class: '!px-6 !py-2.5' },
              }"
              @change="handleViewChange"
            >
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <Icon
                    :name="
                      slotProps.option === 'Table' ? 'mdi:table' : 'mdi:map'
                    "
                    class="text-lg"
                  />
                  {{ slotProps.option }}
                </div>
              </template>
            </SelectButton>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3">
          <template
            v-for="item in filteredTanksData"
            :key="item.tankId"
          >
            <div
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50"
              @click="onCardClick(item)"
            >
              <!-- Card Header -->
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="rounded-lg bg-blue-50 p-1.5 transition-colors duration-300 group-hover:bg-blue-100"
                  >
                    <Icon
                      name="material-symbols:water-damage-rounded"
                      class="text-lg text-blue-600"
                    />
                  </div>
                  <h3 class="font-semibold text-gray-800">
                    {{ item.tank.name }}
                  </h3>
                </div>
                <div
                  class="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-0.5"
                >
                  <div
                    :class="[
                      'h-1.5 w-1.5 rounded-full',
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'animate-live-pulse bg-green-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <span
                    class="text-xs font-medium"
                    :class="[
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'text-green-700'
                        : 'text-red-700',
                    ]"
                  >
                    {{
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'Active'
                        : 'Inactive'
                    }}
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="grid grid-cols-3 gap-2">
                <div
                  class="rounded-lg bg-gray-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-600">WL (m)</p>
                    <Icon
                      name="mdi:water-percent"
                      class="text-sm text-blue-500"
                    />
                  </div>
                  <p class="mt-1 text-base font-semibold text-DarkBlue">
                    {{ formatNumber(item.level) }}
                  </p>
                </div>
                <div
                  class="rounded-lg bg-gray-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-600">WL %</p>
                    <Icon
                      name="mdi:percent"
                      class="text-sm text-blue-500"
                    />
                  </div>
                  <p class="mt-1 text-base font-semibold text-DarkBlue">
                    {{ ((Number(item.level) / 6) * 100).toFixed(2) }}%
                  </p>
                </div>
                <div
                  class="rounded-lg bg-gray-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-600">Vol. (m³)</p>
                    <Icon
                      name="mdi:cube-outline"
                      class="text-sm text-blue-500"
                    />
                  </div>
                  <p class="mt-1 text-base font-semibold text-DarkBlue">
                    {{ formatNumber(Number(item.level) * 170 * 250) }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Table View -->
        <div
          v-if="selectedView === 'Table'"
          class="rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <Table
            v-if="!loading && filteredTanksData.length > 0"
            :headers="headers"
            :columns="columns"
            :value="formattedFilteredTanksData"
            :loading="loading"
            :current-page-report="false"
            :pt="{
              root: { class: '!rounded-xl !overflow-hidden' },
              header: { class: '!bg-gray-50' },
              headerCell: { class: '!py-4' },
              bodyRow: { class: '!sm:text-sm' },
            }"
            @row-click="onRowClick"
          >
            <template #body-stationName="{ data }">
              <div class="flex items-center gap-2">
                <div class="flex h-2 w-2 items-center">
                  <div
                    :class="[
                      'h-2 w-2 rounded-full',
                      new Date(data.originalTimeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'animate-live-pulse bg-green-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                </div>
                <span>{{ data.stationName }}</span>
              </div>
            </template>
            <template #loading>
              <tr
                v-for="i in 10"
                :key="i"
              >
                <td
                  v-for="col in columns"
                  :key="col.field"
                  class="p-4"
                >
                  <div class="h-4 animate-pulse rounded bg-gray-100"></div>
                </td>
              </tr>
            </template>
          </Table>

          <!-- Loading State -->
          <div
            v-else-if="loading"
            class="flex items-center justify-center p-8"
          >
            <div class="w-full space-y-4">
              <div
                v-for="i in 5"
                :key="i"
                class="h-12 animate-pulse rounded-lg bg-gray-100"
              ></div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="flex items-center justify-center p-8"
          >
            <div class="text-center">
              <Icon
                name="mdi:database-off"
                class="mb-3 text-4xl text-gray-400"
              />
              <p class="text-gray-600">No data available</p>
            </div>
          </div>

          <!-- Table Legend -->
          <div
            class="space-y-2 border-t border-gray-100 bg-gray-50 p-6 text-sm text-gray-600"
          >
            <p>* WL ( m ) = Water level in the storage tank</p>
            <p>* WL % = Water level percentage in the storage tank</p>
            <p>* Vol. ( m³ ) = Water volume in the storage tank</p>
          </div>
        </div>

        <!-- Map View -->
        <div
          v-else-if="selectedView === 'Map'"
          class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <Map :stations="filteredMapStations" />
          <div
            v-if="filteredMapStations.length === 0"
            class="mt-6 text-center"
          >
            <Icon
              name="mdi:map-marker-off"
              class="mb-3 text-4xl text-gray-400"
            />
            <p class="text-gray-600">No stations available for map view</p>
          </div>
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

  const handleViewChange = (event) => {
    selectedView.value = event.value;
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0.00';
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const onRowClick = (event) => {
    const { data } = event;
    if (!data?.tankId) {
      console.error('Invalid event or missing required tank data');
      return;
    }

    nextTick(() => {
      // Store additional data needed for the details page
      localStorage.setItem('currentStationId', data.tankId.toString());
      localStorage.setItem('stationName', data.tankName);
      localStorage.setItem('stationType', '1'); // 1 for tanks

      // Navigate to the details page
      router.push({
        path: `/data/details/${data.tankId}`,
      });
    });
  };

  const onCardClick = (item) => {
    if (!item?.tankId) {
      console.error('Invalid item or missing required tank data');
      return;
    }

    nextTick(() => {
      localStorage.setItem('currentStationId', item.tankId.toString());
      localStorage.setItem('stationName', item.tank.name);
      localStorage.setItem('stationType', '1'); // 1 for tanks

      router.push({ path: `/data/details/${item.tankId}` });
    });
  };

  // Update headers to match pipes-water.vue
  // const headers = [
  //   {
  //     text: 'Station Info',
  //     colspan: 1,
  //     class:
  //       '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
  //   },
  //   {
  //     text: 'Last Measurement',
  //     colspan: 4,
  //     class:
  //       '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
  //   },
  // ];

  const columns = [
    {
      header: 'Project Name',
      field: 'stationName',
      sortable: false,
    },
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
            lat: item.station.lat,
            lng: item.station.lng,
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
        stationName: item.tank.name,
        originalTimeStamp: item.timeStamp,
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
    return filteredTanksData.value
      .map((item) => ({
        id: item.tankId,
        lat: item.tank.lat,
        lng: item.tank.lng,
        name: item.tank.name,
        stationType: 1,
        waterLevel: item.level,
        timeStamp: item.timeStamp,
      }))
      .filter((tank) => tank.lat && tank.lng);
  });
</script>

<style>
  .highlight-update {
    animation: highlightFade 1.5s ease-in-out;
    position: relative;
    overflow: hidden;
  }

  /* Add ripple effect on update */
  .highlight-update::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(59, 130, 246, 0.15) 0%,
      transparent 60%
    );
    transform: translate(-50%, -50%) scale(0);
    animation: rippleEffect 1.5s ease-out;
  }

  /* Add subtle glow effect for active cards */
  .card-active {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
    transition: box-shadow 0.3s ease;
  }

  @keyframes highlightFade {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rippleEffect {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  /* Custom styles for PrimeVue components */
  .p-togglebutton {
    @apply !bg-DarkBlue !text-white !transition-all !duration-300;
  }
  .p-togglebutton-checked::before {
    @apply !bg-DarkBlue !text-white;
  }
  .p-togglebutton-checked {
    @apply !bg-DarkBlue/80 !text-white;
  }
  .p-select {
    @apply !text-white !transition-all !duration-300;
  }
</style>
