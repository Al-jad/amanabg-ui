<template>
  <div class="container mx-auto px-4 py-8 sm:px-4 lg:px-8">
    <div class="bg-white p-4 pb-0 shadow sm:rounded-lg">
      <div
        class="mb-8 flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between"
      >
        <div class="mb-4 flex text-nowrap sm:mb-0">
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
      <div
        class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3"
      >
        <template
          v-for="item in filteredPipesData"
          :key="item.stationId"
        >
          <!-- Station Card -->
          <div
            v-if="item.station.stationType === 0"
            :class="[
              'cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
              new Date(item.timeStamp) > new Date(Date.now() - 10 * 60 * 1000)
                ? 'card-active'
                : '',
            ]"
            @click="onCardClick(item)"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="fluent:pipeline-32-filled"
                  class="text-xl text-blue-500"
                />
                <h3 class="font-semibold text-gray-700">
                  {{ item.station.name }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <div
                    :class="[
                      'h-2 w-2 rounded-full',
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'animate-live-pulse bg-green-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <span
                    class="text-xs"
                    :class="[
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'text-green-600'
                        : 'text-red-600',
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
                <Icon
                  name="mdi:information"
                  class="cursor-pointer text-gray-400 hover:text-gray-600"
                  :title="`Last updated: ${new Date(item.timeStamp).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric' })}`"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded bg-gray-50 p-3">
                <p class="mb-1 text-xs font-medium text-gray-500">
                  Discharge (m³/min)
                </p>
                <p class="text-lg font-semibold text-DarkBlue">
                  {{
                    item.dischargeInMinute
                      ? Number(item.dischargeInMinute).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'
                  }}
                </p>
              </div>
              <div class="rounded bg-gray-50 p-3">
                <p class="mb-1 text-xs font-medium text-gray-500">
                  Pressure (m)
                </p>
                <p class="text-lg font-semibold text-DarkBlue">
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
            class="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            @click="onCardClick(item)"
          >
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="material-symbols:water-damage-rounded"
                  class="text-xl text-blue-500"
                />
                <h3 class="font-semibold text-gray-700">
                  {{ item.station.name }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <div
                    :class="[
                      'h-2 w-2 rounded-full',
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'animate-live-pulse bg-green-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <span
                    class="text-xs"
                    :class="[
                      new Date(item.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'text-green-600'
                        : 'text-red-600',
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
                <Icon
                  name="mdi:information"
                  class="cursor-pointer text-gray-400 hover:text-gray-600"
                  :title="`Last updated: ${new Date(item.timeStamp).toLocaleString()}`"
                />
              </div>
            </div>
            <div class="rounded bg-gray-50 p-3">
              <p class="mb-1 text-xs font-medium text-gray-500">
                Water Level (m)
              </p>
              <p class="text-lg font-semibold text-DarkBlue">
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
          </div>
        </template>
      </div>
      <div v-if="selectedView === 'Table'">
        <Table
          v-if="!loading && filteredPipesData.length > 0"
          :headers="headers"
          :columns="columns"
          :value="loading ? Array(10).fill({}) : formattedFilteredPipesData"
          :loading="loading"
          :current-page-report="false"
          @row-click="onRowClick"
        >
          <template #loading>
            <tr
              v-for="i in 10"
              :key="i"
            >
              <td
                v-for="col in columns"
                :key="col.field"
                class="p-3"
              >
                <div class="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
            </tr>
          </template>
        </Table>
        <div
          v-else-if="loading"
          class="flex items-center justify-center p-4"
        >
          <div class="w-full">
            <div
              v-for="i in 5"
              :key="i"
              class="mb-4"
            >
              <div class="h-12 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center"
        >
          <p class="text-gray-500">No data available</p>
        </div>
        <div class="py-4 text-sm">
          <p>* Q ( m³/min ) = Total discharge in the last minute</p>
          <p>* Q ( m³/h ) = Total discharge in the last hour</p>
          <p>* Q ( m³/d ) = Total discharge in the last day</p>
          <p>* P ( m ) = Water pressure in the pipe</p>
          <p>* Cl⁺ ( mg/L ) = Chlorine level in the pipe</p>
          <p>* Turb. ( NTU ) = Turbidity of water in the pipe</p>
          <p>* TDS ( ppm ) = Total dissolved solids in the pipe</p>
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

  const headers = [
    {
      text: 'Station Info',
      colspan: 2,
      class:
        '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
    },
    {
      text: 'Last Measurement',
      colspan: 10,
      class:
        '!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white',
    },
  ];

  const columns = [
    {
      header: 'Status',
      sortable: false,
      field: 'status',
      body: (rowData) => {
        const isActive =
          new Date(rowData.originalTimeStamp) >
          new Date(Date.now() - 10 * 60 * 1000);
        return {
          class: isActive ? 'text-green-600' : 'text-red-600',
          content: isActive ? 'ON' : 'OFF',
        };
      },
    },
    { header: 'Project Name', sortable: false, field: 'stationName' },
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
    { header: 'Water Level', sortable: true, field: 'waterLevel', unit: 'm' },
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
          : '0.00',
        dischargeInHour: item?.dischargeInHour
          ? Number(item.dischargeInHour).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        dischargeInDay: item?.dischargeInDay
          ? Number(item.dischargeInDay).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        pressure: item?.pressure
          ? Number(item.pressure).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        waterLevel: item?.waterLevel
          ? Number(item.waterLevel).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        temperature: item?.temperature
          ? Number(item.temperature).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        cl: item?.cl
          ? Number(item.cl).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        turbidity: item?.turbidity
          ? Number(item.turbidity).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
        tds: item?.electricConductivity
          ? Number(item.electricConductivity * 0.65).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '0.00',
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

  /* Enhanced live pulse animation */
  .animate-live-pulse {
    animation: enhancedLivePulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
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

  @keyframes enhancedLivePulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.2);
    }
  }

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

  @keyframes livePulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-live-pulse {
    animation: livePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
