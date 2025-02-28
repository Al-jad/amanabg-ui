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
                  name="fluent:water-16-filled"
                  class="text-2xl text-blue-600"
                />
              </div>
              <h1 class="text-2xl font-bold text-gray-900">
                Discharge Monitoring Stations
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
            v-for="item in filteredPipesData"
            :key="item.stationId"
          >
            <!-- Station Card -->
            <div
              v-if="item.station.stationType === 0"
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50"
              @click="onCardClick(item)"
            >
              <!-- Card Header - Made more compact -->
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="rounded-lg bg-blue-50 p-1.5 transition-colors duration-300 group-hover:bg-blue-100"
                  >
                    <Icon
                      name="fluent:pipeline-32-filled"
                      class="text-lg text-blue-600"
                    />
                  </div>
                  <h3 class="font-semibold text-gray-800">
                    {{ item.station.name }}
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

              <!-- Card Content - Made more compact -->
              <div class="grid grid-cols-2 gap-2">
                <div
                  class="rounded-lg bg-gray-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-600">Q (m³/min)</p>
                    <Icon
                      name="mdi:pump"
                      class="text-sm text-blue-500"
                    />
                  </div>
                  <p class="mt-1 text-base font-semibold text-DarkBlue">
                    {{
                      item.dischargeInMinute
                        ? Number(item.dischargeInMinute).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : '0.00'
                    }}
                  </p>
                </div>
                <div
                  class="rounded-lg bg-gray-50 p-2.5 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-medium text-gray-600">P (m)</p>
                    <Icon
                      name="mdi:gauge"
                      class="text-sm text-blue-500"
                    />
                  </div>
                  <p class="mt-1 text-base font-semibold text-DarkBlue">
                    {{
                      item.pressure
                        ? Number(item.pressure).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '0.00'
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Tank Card -->
            <div
              v-else
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50"
              @click="onCardClick(item)"
            >
              <!-- Card Header - Made more compact -->
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
                    {{ item.station.name }}
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

              <!-- Card Content - Made more compact -->
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
                    {{
                      item.waterLevel
                        ? Number(item.waterLevel).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '0.00'
                    }}
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
                    {{
                      item.waterLevel
                        ? ((Number(item.waterLevel) / 6) * 100).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : '0.00'
                    }}%
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
                    {{
                      item.waterLevel
                        ? (Number(item.waterLevel) * 170 * 250).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : '0.00'
                    }}
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
            v-if="!loading && filteredPipesData.length > 0"
            :headers="headers"
            :columns="columns"
            :value="loading ? Array(10).fill({}) : formattedFilteredPipesData"
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
            <p>* Q ( m³/min ) = Total discharge in the last minute</p>
            <p>* Q ( m³/h ) = Total discharge in the last hour</p>
            <p>* Q ( m³/d ) = Total discharge in the last day</p>
            <p>* P ( m ) = Water pressure in the pipe</p>
            <p>* WL ( m ) = Water level in the storage tank</p>
            <p>* WL % = Water level percentage in the storage tank</p>
            <p>* Vol. ( m³ ) = Water volume in the storage tank</p>
            <p>* Cl⁺ ( mg/L ) = Chlorine level in the pipe</p>
            <p>* Turb. ( NTU ) = Turbidity of water in the pipe</p>
            <p>* TDS ( ppm ) = Total dissolved solids in the pipe</p>
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
  const route = useRoute();

  const viewOptions = ref(['Table', 'Map']);
  const selectedView = ref('Table');

  const selectedCity = ref('All');
  const cities = ref([]);

  const onRowClick = (event) => {
    const { data } = event;
    if (!data?.stationId || !data.station?.name) {
      console.error('Invalid event or missing required station data');
      return;
    }

    const {
      stationId: stationId,
      station: { city: stationCity, name: stationName, stationType },
    } = data;

    nextTick(() => {
      localStorage.setItem('stationCity', stationCity);
      localStorage.setItem('stationName', stationName);
      localStorage.setItem('stationType', stationType.toString());
      router.push({ path: `/data/details/${parseInt(stationId, 10)}` });
    });
  };

  // const headers = [
  //   {
  //     text: 'Station Info',
  //     colspan: 1,
  //     class:
  //       '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
  //   },
  //   {
  //     text: 'Last Measurement',
  //     colspan: 10,
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
    { header: 'Date Time', sortable: true, field: 'timeStamp' },
    {
      header: 'Q *',
      sortable: true,
      field: 'dischargeInMinute',
      unit: 'm³/min',
    },
    { header: 'Q *', sortable: true, field: 'dischargeInHour', unit: 'm³/h' },
    { header: 'Q *', sortable: true, field: 'dischargeInDay', unit: 'm³/d' },
    { header: 'P *', sortable: true, field: 'pressure', unit: 'm' },
    { header: 'WL (m)', sortable: true, field: 'waterLevel', unit: 'm' },
    {
      header: 'WL %',
      sortable: true,
      //! add % to the row
      field: 'waterLevelPercentage',
      unit: '%',
    },
    { header: 'Total Vol.', sortable: true, field: 'totalVolume', unit: 'm³' },
    { header: 'Temp', sortable: true, field: 'temperature', unit: 'C' },
    { header: 'Cl⁺ *', sortable: true, field: 'cl', unit: 'mg/L' },
    { header: 'Turb *', sortable: true, field: 'turbidity', unit: 'NTU' },
    { header: 'TDS *', sortable: true, field: 'tds', unit: 'ppm' },
  ].map((column) => ({
    ...column,
    class: '!bg-DarkBlue !outline !outline-1 !outline-white !text-white',
  }));

  const stationStore = useStationStore();

  const pipesData = computed(() => {
    const storePipesData = stationStore.pipesData;
    return Array.isArray(storePipesData) ? storePipesData : [storePipesData];
  });

  const filteredPipesData = computed(() => {
    if (!selectedCity.value || selectedCity.value === 'All')
      return pipesData.value;
    return pipesData.value.filter(
      (item) => item.station.city === selectedCity.value
    );
  });

  const formattedFilteredPipesData = computed(() => {
    return filteredPipesData.value.map((item) => {
      const date = new Date(item?.timeStamp);
      const waterLevel = Number(item?.waterLevel) || 0;
      const waterLevelPercentage = waterLevel
        ? ((waterLevel / 6) * 100).toFixed(2)
        : '-';
      const totalVolume = waterLevel
        ? (waterLevel * 170 * 250).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '-';

      return {
        ...item,
        stationName: item?.station?.name,
        stationCity: item?.station?.city,
        originalTimeStamp: item?.timeStamp,
        timeStamp: date.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        dischargeInMinute: item?.dischargeInMinute
          ? Number(item.dischargeInMinute).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        dischargeInHour: item?.dischargeInHour
          ? Number(item.dischargeInHour).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        dischargeInDay: item?.dischargeInDay
          ? Number(item.dischargeInDay).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        pressure: item?.pressure
          ? Number(item.pressure).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        waterLevel: waterLevel
          ? waterLevel.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        waterLevelPercentage: `${waterLevelPercentage ? waterLevelPercentage : '-'}`,
        totalVolume: totalVolume ? totalVolume : '-',
        temperature: item?.temperature
          ? Number(item.temperature).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        cl: item?.cl
          ? Number(item.cl).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        turbidity: item?.turbidity
          ? Number(item.turbidity).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
        tds: item?.electricConductivity
          ? (Number(item.electricConductivity) * 0.65).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
      };
    });
  });

  const filteredMapStations = computed(() => {
    return filteredPipesData.value.filter((item) => {
      return (
        item &&
        item.station &&
        typeof item.station === 'object' &&
        'lat' in item.station &&
        'lng' in item.station &&
        item.station.lat !== null &&
        item.station.lng !== null
      );
    });
  });

  const dataSource = ref('API');
  const lastUpdated = ref(null);
  const loading = ref(true);

  const fetchInitialData = async () => {
    // Only fetch if we need to refresh the data
    if (stationStore.shouldRefreshData()) {
      loading.value = true;
      try {
        const { $axios } = useNuxtApp();
        const { data } = await $axios.get('/Pipes/latest_data');
        stationStore.setPipesData(data);
        lastUpdated.value = new Date().toLocaleString();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        loading.value = false;
      }
    } else {
      // Use persisted data
      lastUpdated.value = new Date(stationStore.lastUpdate).toLocaleString();
      loading.value = false;
    }
  };

  const initializeComponent = async () => {
    const view = route.query.view?.toLowerCase();
    if (view === 'map') {
      selectedView.value = 'Map';
    }

    // Initialize with persisted data if available
    if (
      stationStore.pipesData.length > 0 &&
      !stationStore.shouldRefreshData()
    ) {
      lastUpdated.value = new Date(stationStore.lastUpdate).toLocaleString();
      loading.value = false;
    } else {
      await fetchInitialData();
    }

    // Always connect to WebSocket for real-time updates
    stationStore.connect();
  };

  onMounted(async () => {
    await initializeComponent();
  });

  const onCardClick = (item) => {
    if (!item?.stationId || !item.station?.name) {
      console.error('Invalid item or missing required station data');
      return;
    }

    const {
      stationId,
      station: { city: stationCity, name: stationName, stationType },
    } = item;

    nextTick(() => {
      localStorage.setItem('stationCity', stationCity);
      localStorage.setItem('stationName', stationName);
      localStorage.setItem('stationType', stationType.toString());
      router.push({ path: `/data/details/${parseInt(stationId, 10)}` });
    });
  };
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
