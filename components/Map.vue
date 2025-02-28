<template>
  <div class="h-[30rem] w-full">
    <client-only>
      <l-map
        :use-global-leaflet="false"
        v-if="isMapReady"
        ref="map"
        :zoom="zoom"
        :center="centerLatLng"
        :options="{ attributionControl: false }"
        @update:zoom="zoomUpdate"
        @update:center="centerUpdate"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        />
        <l-marker
          v-for="station in filteredStations"
          :key="station.id"
          :lat-lng="[station.lat, station.lng]"
        >
          <l-popup>
            <div
              class="group w-64 cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50"
              @click="handleClick(station)"
            >
              <!-- Header Section -->
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div
                    class="rounded-md bg-blue-50 p-1 transition-colors duration-300 group-hover:bg-blue-100"
                  >
                    <Icon
                      :name="
                        station.stationType === 1
                          ? 'material-symbols:water-damage-rounded'
                          : 'fluent:pipeline-32-filled'
                      "
                      class="text-base text-blue-600"
                    />
                  </div>
                  <h3 class="text-sm font-semibold text-gray-800">
                    {{ station.name }}
                  </h3>
                </div>
                <div
                  class="flex items-center gap-1 rounded-full bg-gray-50 px-1.5 py-0.5"
                >
                  <div
                    :class="[
                      'h-1 w-1 rounded-full',
                      new Date(station.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'animate-live-pulse bg-green-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <span
                    class="text-[10px] font-medium"
                    :class="[
                      new Date(station.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'text-green-700'
                        : 'text-red-700',
                    ]"
                  >
                    {{
                      new Date(station.timeStamp) >
                      new Date(Date.now() - 10 * 60 * 1000)
                        ? 'Active'
                        : 'Inactive'
                    }}
                  </span>
                </div>
              </div>

              <!-- Content Section -->
              <div class="grid grid-cols-1 gap-1.5">
                <div
                  class="rounded-md bg-gray-50 p-2 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-[10px] font-medium text-gray-600">
                      Last Update
                    </p>
                    <Icon
                      name="mdi:clock-outline"
                      class="text-xs text-blue-500"
                    />
                  </div>
                  <div class="mt-0.5">
                    <p class="text-xs font-semibold text-DarkBlue">
                      {{ formatDate(station.timeStamp) }}
                    </p>
                    <p class="text-[10px] text-gray-500">
                      {{ formatTime(station.timeStamp) }}
                    </p>
                  </div>
                </div>

                <div
                  class="rounded-md bg-gray-50 p-2 transition-colors duration-300 group-hover:bg-blue-50"
                >
                  <div class="flex items-center justify-between">
                    <p class="text-[10px] font-medium text-gray-600">
                      {{
                        station.stationType === 1
                          ? 'Water Level'
                          : 'Discharge Rate'
                      }}
                    </p>
                    <Icon
                      :name="
                        station.stationType === 1
                          ? 'mdi:water-percent'
                          : 'mdi:pump'
                      "
                      class="text-xs text-blue-500"
                    />
                  </div>
                  <p class="mt-0.5 text-sm font-semibold text-DarkBlue">
                    {{
                      station.stationType === 1
                        ? formatWaterLevel(station.waterLevel) + ' m'
                        : formatDischarge(station.dischargeInMinute) + ' m³/min'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script setup>
  import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import 'leaflet/dist/leaflet.css';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStationDetailsDataStore } from '../stores/stationDetailsData';

  const props = defineProps({
    stations: {
      type: Array,
      required: true,
      default: () => [],
    },
  });

  const zoom = ref(11);
  const centerLatLng = ref([33.3151, 44.3672]);
  const router = useRouter();
  const map = ref(null);
  const isMapReady = ref(false);

  const filteredStations = computed(() => {
    if (!Array.isArray(props.stations)) {
      console.error('stations prop is not an array');
      return [];
    }

    return props.stations
      .filter((station) => {
        if (!station) return false;
        const lat = station?.station?.lat ?? station?.lat;
        const lng = station?.station?.lng ?? station?.lng;
        return lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
      })
      .map((station) => ({
        id:
          station.id ||
          station.stationId ||
          Math.random().toString(36).substr(2, 9),
        lat: parseFloat(station?.station?.lat ?? station?.lat),
        lng: parseFloat(station?.station?.lng ?? station?.lng),
        name: station?.station?.name || station?.name || 'Unnamed Station',
        dischargeInMinute: station?.dischargeInMinute,
        waterLevel: station?.waterLevel,
        stationType: station?.station?.stationType ?? station?.stationType ?? 0,
        timeStamp: station?.timeStamp || Date.now(),
      }));
  });

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-GB');
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDischarge(discharge) {
    return discharge != null ? parseFloat(discharge).toFixed(2) : 'N/A';
  }

  function formatWaterLevel(waterLevel) {
    return waterLevel != null ? parseFloat(waterLevel).toFixed(2) : 'N/A';
  }

  function handleClick(station) {
    if (process.client) {
      // Clear previous station data from localStorage
      const currentStationId = localStorage.getItem('currentStationId');

      // Only update storage if it's a different station
      if (currentStationId !== station.id.toString()) {
        localStorage.setItem('currentStationId', station.id);
        localStorage.setItem('stationName', station.name);
        localStorage.setItem('stationCity', station.city || 'N/A');
        localStorage.setItem('stationType', station.stationType.toString());

        // Reset any persisted data in the store
        const stationStore = useStationDetailsDataStore();
        stationStore.$reset();
      }
    }
    router.push(`/data/details/${station.id}`);
  }

  function zoomUpdate(newZoom) {
    zoom.value = newZoom;
  }

  function centerUpdate(newCenter) {
    centerLatLng.value = newCenter;
  }

  onMounted(() => {
    // Ensure the map is only rendered on the client-side
    isMapReady.value = true;
  });
</script>

<style scoped>
  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 20px;
  }

  :deep(.leaflet-popup-content-wrapper) {
    padding: 0;
    overflow: hidden;
    border-radius: 0.75rem;
  }

  :deep(.leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }

  :deep(.leaflet-popup-close-button) {
    display: none;
  }

  .animate-live-pulse {
    animation: livePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes livePulse {
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
</style>
