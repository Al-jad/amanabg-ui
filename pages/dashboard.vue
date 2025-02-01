<template>
  <main class="container min-h-screen p-4 mx-auto mt-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
    </div>
    <div class="p-6 bg-white rounded-lg shadow-lg">
      <div class="space-y-6">
        <div class="p-6 rounded-lg bg-gray-50">
          <h2 class="mb-4 text-xl font-semibold text-gray-700">
            Station Information
          </h2>
          <div class="grid gap-6 md:grid-cols-3">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Select Station
              </label>
              <Select
                v-model="stationData.selectedStation"
                :options="stationOptions"
                optionLabel="name"
                optionValue="id"
                class="w-full !border-DarkBlue !bg-white !text-black"
                placeholder="Choose a station"
                @change="onStationSelect"
                :pt="{
                  list: {
                    class: '!text-black  !bg-white',
                  },
                  listContainer: {
                    class: '!text-black !bg-white',
                  },
                  option: {
                    class:
                      '!text-black aria-selected:!bg-DarkBlue/40 hover:!bg-gray-200 !bg-white',
                  },
                  label: {
                    class: '!text-black !bg-white',
                  },
                }"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Base Area
              </label>
              <InputNumber
                v-model="stationData.baseArea"
                class="w-full !p-0"
                :inputClass="'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="Enter base area"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Max Height
              </label>
              <InputNumber
                v-model="stationData.maxHeight"
                class="w-full !p-0"
                :inputClass="'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'"
                placeholder="Enter max height"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Current Volume
              </label>
              <div class="text-lg font-semibold">
                {{ formatNumber(currentVolume) }} L
              </div>
            </div>
          </div>
          <div class="mt-6">
            <button
              @click="saveStationData"
              class="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="!stationData.selectedStation"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
  import { useTanksStore } from "~/stores/tanks";

  const tanksStore = useTanksStore();
  const stationOptions = computed(() => tanksStore.tankOptions);
  const stationData = ref({
    selectedStation: null,
    baseArea: null,
    maxHeight: null,
  });

  const onStationSelect = () => {
    const selectedTank = tanksStore.getTankById(
      stationData.value.selectedStation,
    );
    if (selectedTank) {
      stationData.value.baseArea = selectedTank.baseArea;
      stationData.value.maxHeight = selectedTank.tankHeight;
    }
  };

  const saveStationData = async () => {
    try {
      await tanksStore.updateTankData({
        id: stationData.value.selectedStation,
        baseArea: stationData.value.baseArea,
        maxHeight: stationData.value.maxHeight,
      });
    } catch (error) {
      console.error("Failed to save station data:", error);
    }
  };

  const currentVolume = ref(0);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  onMounted(() => {
    tanksStore.fetchTanks();
  });
</script>
<style>
  .p-inputnumber .p-inputtext {
    @apply !border-DarkBlue !bg-white !text-black focus:!ring-DarkBlue;
  }
</style>
