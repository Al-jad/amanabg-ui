<template>
  <div class="w-full h-[30rem]">
    <l-map ref="map" :zoom="zoom" :markerZoomAnimation="true" :zoomAnimation="true" :center="centerLatLng"
        :options="{ attributionControl: false }" @update:zoom="zoomUpdate" @update:center="centerUpdate">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="OpenStreetMap">
        </l-tile-layer>
        <l-marker v-for="station in filteredStations" :lat-lng="[station?.lat || 0, station?.lng || 0]" :key="station.id">
            <l-popup class="text-black !w-52 h-48 sm:w-44 sm:h-48" @click="handleClick(station.id)">
                <div class="flex col-span-2 mb-2 justify-evenly items-center">
                    <h1 
                        class="text-2xl sm:!text-xl">
                        {{ station?.name || 'Unnamed Station' }}
                    </h1>
                    <i class="pi -mt-2 pi-external-link text-DarkBlue"></i>
                </div>
                <span
                    class="p-0 text-xl sm:text-base -my-1">
                    {{ new Date(station?.lastEntryData?.timeStamp || Date.now()).toLocaleDateString('en-GB') }}
                </span>
                <br>
                <span
                    class="p-0 text-xl sm:text-base -my-4">
                    ( {{ new Date(station?.lastEntryData?.timeStamp || Date.now()).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit'
                    }) }} )
                </span>
                <br>
                <span 
                    class="p-0 text-xl sm sm:text-base">
                    Water Quality Index : {{ station?.lastEntryData?.wqi || '0' }}
                </span>
            </l-popup>
        </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  stations: {
      type: Array,
      required: true,
      default: () => []
  }
});

const zoom = ref(6);
const centerLatLng = ref([33.5152, 44.3661]);
const router = useRouter();
const map = ref(null);
const L = ref(null);

const filteredStations = computed(() => {
  if (Array.isArray(props?.stations)) {
    return props.stations.filter(st => st.lat != null && st.lng != null);
  } else if (props?.stations?.data && Array.isArray(props.stations.data)) {
    return props.stations.data.filter(st => st.lat != null && st.lng != null);
  } else {
    return [];
  }
});

function handleClick(stationId) {
  router.push(`/stations/manual/details/${stationId}`);
}


onMounted(async () => {
  if (process.client) {
    const leaflet = await import('leaflet');
    L.value = leaflet.default;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(link);
  }
});

function zoomUpdate(newZoom) {
  zoom.value = newZoom;
}

function centerUpdate(newCenter) {
  centerLatLng.value = newCenter;
}

</script>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
  border-radius: 20px;
}
</style>
