<template>
  <div v-if="stationDetails">
    <h1>{{ stationDetails.name }}</h1>
    <p>City: {{ stationDetails.city }}</p>
    <div v-if="stationDetails.latestMeasurement">
      <h2>Latest Measurement</h2>
      <p>Timestamp: {{ formatDate(stationDetails.latestMeasurement.timeStamp) }}</p>
      <p>Discharge: {{ stationDetails.latestMeasurement.discharge }} m³/s</p>
      <p>Total Volume Per Hour: {{ stationDetails.latestMeasurement.totalVolumePerHour }} m³</p>
      <p>Total Volume Per Day: {{ stationDetails.latestMeasurement.totalVolumePerDay }} m³</p>
      <p>Pressure: {{ stationDetails.latestMeasurement.pressure }} bar</p>
      <p>CL: {{ stationDetails.latestMeasurement.cl }} mg/L</p>
      <p>Turbidity: {{ stationDetails.latestMeasurement.turbidity }} NTU</p>
      <p>Electric Conductivity: {{ stationDetails.latestMeasurement.electricConductivity }} µS/cm</p>
    </div>
  </div>
  <div v-else-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
</template>

<script setup>
const route = useRoute();
const stationDetailsStore = useStationDetailsStore();

const { fetchStationDetails } = stationDetailsStore;
const stationDetails = computed(() => {
  const details = stationDetailsStore.getStationDetails;
  if (details && details.latestMeasurement) {
    return {
      ...details,
      latestMeasurement: {
        timeStamp: details.latestMeasurement.timeStamp,
        discharge: details.latestMeasurement.discharge,
        totalVolumePerHour: details.latestMeasurement.totalVolumePerHour,
        totalVolumePerDay: details.latestMeasurement.totalVolumePerDay,
        pressure: details.latestMeasurement.pressure,
        cl: details.latestMeasurement.cl,
        turbidity: details.latestMeasurement.turbidity,
        electricConductivity: details.latestMeasurement.electricConductivity
      }
    };
  }
  return null;
});
const isLoading = computed(() => stationDetailsStore.isLoading);
const error = computed(() => stationDetailsStore.getError);

onMounted(async () => {
  const stationId = route.params.id;
  await fetchStationDetails(stationId);
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}
</script>