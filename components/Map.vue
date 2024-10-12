<template>
  <div class="h-[30rem] w-full">
    <client-only>
      <l-map :use-global-leaflet="false"
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
            <div class="h-48 !w-52 text-black sm:h-48 sm:w-44">
              <div class="col-span-2 mb-2 flex items-center justify-evenly">
                <h1 class="text-2xl sm:!text-xl">
                  {{ station.name }}
                </h1>
                <i class="pi pi-external-link -mt-2 text-DarkBlue"></i>
              </div>
              <span class="-my-1 p-0 text-xl sm:text-base">
                {{ formatDate(station.timeStamp) }}
              </span>
              <br />
              <span class="-my-4 p-0 text-xl sm:text-base">
                ({{ formatTime(station.timeStamp) }})
              </span>
              <br />
              <span class="sm p-0 text-xl sm:text-base">
                Q (m³/min): {{ formatDischarge(station.discharge) }}
              </span>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

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
    .filter(station => {
      if (!station) return false;
      const lat = station?.station?.lat ?? station?.lat;
      const lng = station?.station?.lng ?? station?.lng;
      return lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
    })
    .map(station => ({
      id: station.id || station.stationId || Math.random().toString(36).substr(2, 9),
      lat: parseFloat(station?.station?.lat ?? station?.lat),
      lng: parseFloat(station?.station?.lng ?? station?.lng),
      name: station?.station?.name || station?.name || 'Unnamed Station',
      discharge: station?.discharge,
      timeStamp: station?.timeStamp || Date.now(),
    }));
});

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-GB");
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDischarge(discharge) {
  return discharge != null ? parseFloat(discharge).toFixed(2) : 'N/A';
}

function handleClick(station) {
  if (process.client) {
    localStorage.setItem('stationName', station.name);
    localStorage.setItem('stationCity', station.city || 'N/A');
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
</style>
