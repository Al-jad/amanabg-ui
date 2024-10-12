<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ error }}</p>
    </div>
    <div v-else-if="minuteData && minuteData.length > 0">
      <div class="flex flex-col items-start gap-4 mb-8">
        <NuxtLink :to="`/data/details/${$route.params.id}`" class="text-DarkBlue hover:text-DarkBlue/80 transition-colors duration-300 flex items-center">
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to Hourly Data
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-800 pb-2 w-full">
          Minute Data for {{ formattedDate }}
        </h1>
      </div>
      <div class="rounded-lg bg-white p-6 shadow-lg">
        <Table
          :headers="headers"
          :columns="columns"
          :value="formattedMinuteData"
          class="w-full"
          :sortField="'time'"
          :sortOrder="1"
        >
          <template #body="slotProps">
            <Row v-for="col in columns" :key="col.field">
              <template v-if="col.field === 'discharge'">
                <span :class="getDischargeColor(slotProps.data[col.field])">
                  {{ slotProps.data[col.field] }}
                  <span
                    v-html="getDischargeArrow(slotProps.data[col.field])"
                  ></span>
                </span>
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </Row>
          </template>
        </Table>
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-lg text-gray-600">No minute data available for the selected date</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

const route = useRoute();
const stationDataMinuteStore = useStationDataMinuteStore();

const {
  minuteData,
  loading,
  error,
} = storeToRefs(stationDataMinuteStore);



const columns = [
  { header: "Time", sortable: true, field: "time" },
  { header: "Q", sortable: true, field: "discharge", unit: "m³/min" },
  { header: "Q", sortable: true, field: "totalVolumePerHour", unit: "m³/h" },
  { header: "Q", sortable: true, field: "totalVolumePerDay", unit: "m³/d" },
  { header: "P.", sortable: true, field: "pressure", unit: "bar" },
  { header: "cL⁺", sortable: true, field: "cl", unit: "mg/L" },
  { header: "Turb.", sortable: true, field: "turbidity", unit: "NTU" },
  { header: "EC", sortable: true, field: "electricConductivity", unit: "μS/cm" },
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white",
}));

const formattedDate = computed(() => {
  const date = new Date(route.query.date);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

const formattedMinuteData = computed(() => {
  if (!minuteData.value) return [];

  return minuteData.value.map((item) => {
    const date = new Date(item.timeStamp);
    return {
      ...item,
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  });
});

onMounted(async () => {
  const stationId = parseInt(route.params.id, 10);
  const date = route.query.date;

  if (isNaN(stationId) || !date) {
    console.error("Invalid station ID or date");
    return;
  }

  await stationDataMinuteStore.fetchMinuteData({ stationId, date });
});

const getDischargeColor = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "text-red-500" : "text-green-500";
};

const getDischargeArrow = (discharge) => {
  const minDischarge = 11;
  return discharge < minDischarge ? "&darr;" : "&uarr;";
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>
