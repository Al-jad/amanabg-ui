<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p class="text-lg text-gray-600">Loading...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p class="text-lg font-semibold">{{ error }}</p>
    </div>
    <div v-else-if="minuteData && minuteData.length > 0">
      <div class="mb-8 flex flex-col items-start gap-4">
        <NuxtLink
          :to="`/data/details/${$route.params.id}`"
          class="flex items-center text-DarkBlue transition-colors duration-300 hover:text-DarkBlue/80"
        >
          <Icon name="mdi:arrow-left" class="mr-2" />
          Back to Hourly Data
        </NuxtLink>
        <div class="flex flex-col gap-2 py-2" >
          <h1 class="text-xl font-bold">
            {{ stationName }}
          </h1>
          <p class="">
            Measurements in minutes for {{ formattedDate }}
          </p>
        </div>
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
              <template v-else-if="col.field === 'electricConductivity'">
                {{ slotProps.data[col.field].toFixed(2) }}
              </template>
              <template v-else>
                {{ slotProps.data[col.field] }}
              </template>
            </Row>
          </template>
        </Table>
      </div>
      <EChart
        :hourlyData="formattedMinuteData"
        :paramNames="paramNames"
        :selectedParam="'discharge'"
        :units="units"
      />
    </div>
    <div v-else class="text-center">
      <p class="text-lg text-gray-600">
        No minute data available for the selected date
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStationDataMinuteStore } from '@/stores/stationDataMinute'

const route = useRoute();
const stationDataMinuteStore = useStationDataMinuteStore();

const { minuteData, loading, error } = storeToRefs(stationDataMinuteStore);

const paramNames = {
  discharge: {
    short: "Q (min)",
    full: "Q (Minute)",
  },
  totalVolumePerHour: {
    short: "Q (h)",
    full: "Q (Hourly)",
  },
  totalVolumePerDay: {
    short: "Q (d)",
    full: "Q (Daily)",
  },
  pressure: {
    short: "P",
    full: "Pressure",
  },
  cl: {
    short: "Cl",
    full: "Chlorine",
  },
  turbidity: {
    short: "Turb.",
    full: "Turbidity",
  },
  electricConductivity: {
    short: "TDS",
    full: "Total Dissolved Solids",
  },
};

const units = {
  discharge: "m³/min",
  totalVolumePerHour: "m³/h",
  totalVolumePerDay: "m³/d",
  pressure: "bar",
  cl: "mg/L",
  turbidity: "NTU",
  electricConductivity: "ppm",
};

const columns = [
  { header: "Time", sortable: true, field: "time" },
  { header: "Q ( Minute )", sortable: true, field: "discharge", unit: "m³/min" },
  { header: "Q ( Hour )", sortable: true, field: "totalVolumePerHour", unit: "m³/h" },
  { header: "Q ( Day )", sortable: true, field: "totalVolumePerDay", unit: "m³/d" },
  { header: "P", sortable: true, field: "pressure", unit: "bar" },
  { header: "Cl⁺", sortable: true, field: "cl", unit: "mg/L" },
  { header: "Turb", sortable: true, field: "turbidity", unit: "NTU" },
  {
    header: "TDS",
    sortable: true,
    field: "electricConductivity",
    unit: "mg/L",
  },
].map((column) => ({
  ...column,
  class:
    "!bg-DarkBlue !outline !outline-1 !outline-white !text-white",
}));

const stationName = ref('');

const formattedDate = computed(() => {
  const date = new Date(route.query.date);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const formattedMinuteData = computed(() => {
  if (!minuteData.value) return [];

  return minuteData.value.map((item) => {
    const date = new Date(item.timeStamp);
    return {
      ...item,
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      timeStamp: date,
      electricConductivity: Number(
        (item.electricConductivity * 0.65).toFixed(2),
      ),
    };
  });
});

onMounted(async () => {
  const stationId = parseInt(route.params.id, 10);
  const date = route.query.date;
  stationName.value = route.query.stationName ? decodeURIComponent(route.query.stationName) : 'N/A';

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
