<template>
  <div class="h-[30rem] w-full">
    <l-map
      ref="map"
      :zoom="zoom"
      :markerZoomAnimation="true"
      :zoomAnimation="true"
      :center="centerLatLng"
      :options="{ attributionControl: false }"
      @update:zoom="zoomUpdate"
      @update:center="centerUpdate"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      >
      </l-tile-layer>
      <l-marker
        v-for="station in filteredStations"
        :lat-lng="[station?.lat || 0, station?.lng || 0]"
        :key="station.id"
      >
        <l-popup
          class="h-48 !w-52 text-black sm:h-48 sm:w-44"
          @click="handleClick(station.id)"
        >
          <div class="col-span-2 mb-2 flex items-center justify-evenly">
            <h1 class="text-2xl sm:!text-xl">
              {{ station?.name || "Unnamed Station" }}
            </h1>
            <i class="pi pi-external-link -mt-2 text-DarkBlue"></i>
          </div>
          <span class="-my-1 p-0 text-xl sm:text-base">
            {{
              new Date(
                station?.lastEntryData?.timeStamp || Date.now(),
              ).toLocaleDateString("en-GB")
            }}
          </span>
          <br />
          <span class="-my-4 p-0 text-xl sm:text-base">
            (
            {{
              new Date(
                station?.lastEntryData?.timeStamp || Date.now(),
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
            )
          </span>
          <br />
          <span class="sm p-0 text-xl sm:text-base">
            Water Quality Index : {{ station?.lastEntryData?.wqi || "0" }}
          </span>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  stations: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const zoom = ref(6);
const centerLatLng = ref([33.5152, 44.3661]);
const router = useRouter();
const map = ref(null);
const L = ref(null);

const filteredStations = computed(() => {
  if (Array.isArray(props?.stations)) {
    return props.stations.filter((st) => st.lat != null && st.lng != null);
  } else if (props?.stations?.data && Array.isArray(props.stations.data)) {
    return props.stations.data.filter((st) => st.lat != null && st.lng != null);
  } else {
    return [];
  }
});

function handleClick(stationId) {
  router.push(`/stations/manual/details/${stationId}`);
}

onMounted(async () => {
  if (process.client) {
    const leaflet = await import("leaflet");
    L.value = leaflet.default;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
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
