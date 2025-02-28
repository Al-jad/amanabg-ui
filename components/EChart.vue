<template>
  <div class="mt-8 rounded-lg bg-white p-8 shadow-lg">
    <div v-if="dataLoaded && hourlyData && hourlyData.length > 0">
      <p class="text-lg font-bold">Chart View</p>
      <div class="mb-6 flex items-center">
        <label
          for="paramSelect"
          class="mr-4 text-lg font-medium sm:text-nowrap sm:text-base"
        >
          Select Parameter:
        </label>
        <Select
          v-model="selectedParam"
          :options="availableParams"
          optionLabel="label"
          optionValue="value"
          class="w-full max-w-xs border-none !bg-DarkBlue !text-white"
        />
      </div>
      <client-only>
        <v-chart
          v-if="chartReady"
          class="chart"
          :option="chartOption"
          autoresize
        />
      </client-only>
    </div>
    <div
      v-else-if="!dataLoaded"
      class="flex h-64 items-center justify-center text-lg text-gray-600"
    >
      Loading data...
    </div>
    <div
      v-else
      class="flex h-64 items-center justify-center text-lg text-gray-600"
    >
      No data available for the chart.
    </div>
  </div>
</template>
<script setup>
  import { LineChart } from 'echarts/charts';
  import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { computed, ref, shallowRef, watch } from 'vue';
  import VChart from 'vue-echarts';
  use([
    CanvasRenderer,
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    ToolboxComponent,
  ]);
  const props = defineProps({
    hourlyData: {
      type: Array,
      required: true,
      default: () => [],
    },
    paramNames: {
      type: Object,
      required: true,
    },
    selectedParam: {
      type: String,
      default: 'discharge',
    },
    units: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:selectedParam']);

  // Initialize selectedParam based on stationType
  const getDefaultParam = () => {
    const stationType = parseInt(localStorage.getItem('stationType') || '0');
    return stationType === 1 ? 'waterLevel' : 'discharge';
  };

  const selectedParam = ref(getDefaultParam());

  // Emit initial value
  emit('update:selectedParam', selectedParam.value);

  const chartReady = ref(false);
  const dataLoaded = ref(false);

  // Watch for stationType changes
  watch(
    () => localStorage.getItem('stationType'),
    (newType) => {
      const stationType = parseInt(newType || '0');
      const newParam = stationType === 1 ? 'waterLevel' : 'discharge';
      selectedParam.value = newParam;
      emit('update:selectedParam', newParam);
    },
    { immediate: true }
  );

  // Watch for local selectedParam changes
  watch(
    selectedParam,
    (newValue) => {
      emit('update:selectedParam', newValue);
    },
    { immediate: true }
  );

  // Watch for prop changes
  watch(
    () => props.selectedParam,
    (newValue) => {
      if (newValue !== selectedParam.value) {
        selectedParam.value = newValue;
      }
    }
  );

  const availableParams = computed(() => {
    const stationType = parseInt(localStorage.getItem('stationType') || '0');

    // Filter out parameters based on station type
    const filteredParams = Object.entries(props.paramNames).filter(([key]) => {
      if (stationType === 0) {
        // For stations: show discharge, pressure, temp, cl, turbidity, tds
        return [
          'discharge',
          'pressure',
          'temp',
          'cl',
          'turbidity',
          'tds',
        ].includes(key);
      } else {
        // For tanks: show waterLevel, waterLevelPercentage, totalVolume, temp, pressure
        return [
          'waterLevel',
          'waterLevelPercentage',
          'totalVolume',
          'temp',
          'pressure',
        ].includes(key);
      }
    });

    return filteredParams.map(([key, value]) => ({
      label: value.full,
      value: key,
    }));
  });
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };
  const getDischargeUnit = () => {
    // Get duration from localStorage (0: minute, 1: hour, 2: day)
    const duration = parseInt(localStorage.getItem('selectedDuration') || '0');
    switch (duration) {
      default:
        return 'm³';
    }
  };
  const chartOption = shallowRef({});
  const updateChartOption = () => {
    if (
      !dataLoaded.value ||
      !props.hourlyData ||
      props.hourlyData.length === 0 ||
      !selectedParam.value
    ) {
      console.warn('Data not ready for chart update');
      chartReady.value = false;
      return;
    }
    if (!props.hourlyData[0].hasOwnProperty(selectedParam.value)) {
      console.warn(`Invalid selectedParam: ${selectedParam.value}`);
      const validParam = Object.keys(props.paramNames).find(
        (key) => key in props.paramNames
      );
      if (validParam) {
        selectedParam.value = validParam;
      } else {
        chartReady.value = false;
        return;
      }
    }
    try {
      // Create an array of objects with both date and value for sorting
      const dataPoints = props.hourlyData.map((item) => {
        const timestamp = item.timeStamp
          ? new Date(item.timeStamp).getTime()
          : 0;
        let value = item[selectedParam.value];

        // Convert string numbers back to numbers for the chart
        if (typeof value === 'string') {
          value = Number(value.replace(/,/g, ''));
        }

        // Handle specific parameter calculations
        if (selectedParam.value === 'discharge') {
          value = Number(value) || 0;
        } else if (selectedParam.value === 'totalVolume') {
          const waterLevel = Number(item.waterLevel?.replace(/,/g, '') || 0);
          value = waterLevel * 170 * 250;
        } else if (
          selectedParam.value === 'electricConductivity' &&
          value !== null
        ) {
          value = Number((value * 0.65).toFixed(2));
        }

        return {
          timestamp,
          formattedDate: item.timeStamp
            ? formatDate(item.timeStamp)
            : 'Unknown Date',
          value,
        };
      });

      // Sort data points by timestamp
      dataPoints.sort((a, b) => a.timestamp - b.timestamp);

      // Separate sorted dates and values
      const filteredDates = [];
      const filteredValues = [];
      dataPoints.forEach((point) => {
        if (point.value !== null) {
          filteredDates.push(point.formattedDate);
          filteredValues.push(point.value);
        }
      });

      // Get the appropriate unit for discharge
      const unit =
        selectedParam.value === 'discharge'
          ? getDischargeUnit()
          : props.units[selectedParam.value] || '';

      chartOption.value = {
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: 'category',
          data: filteredDates,
          axisLabel: {
            rotate: 0,
            interval: 'auto',
            formatter: (value) => {
              return value.split(',')[0] + '\n' + value.split(',')[1];
            },
            margin: 15,
          },
        },
        yAxis: {
          type: 'value',
          name: unit,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 14,
          },
        },
        series: [
          {
            data: filteredValues,
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#3B82F6',
            },
            itemStyle: {
              color: '#3B82F6',
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const value = params[0].value;
            const date = params[0].axisValue;
            const paramName =
              props.paramNames[selectedParam.value]?.full ||
              selectedParam.value;
            const tooltipUnit =
              selectedParam.value === 'discharge'
                ? getDischargeUnit()
                : props.units[selectedParam.value] || '';
            let displayValue =
              typeof value === 'number'
                ? value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : value;
            return `<strong>${date}</strong><br/>${paramName}: ${displayValue} ${tooltipUnit}`;
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#333',
          },
        },
      };
      chartReady.value = true;
    } catch (error) {
      console.error('Error in updateChartOption:', error);
      console.error('Error stack:', error.stack);
      chartReady.value = false;
    }
  };
  watch(
    () => props.hourlyData,
    (newValue) => {
      if (Array.isArray(newValue) && newValue.length > 0) {
        dataLoaded.value = true;
        if (!selectedParam.value || !props.paramNames[selectedParam.value]) {
          selectedParam.value = Object.keys(props.paramNames)[0];
        }
        updateChartOption();
      } else {
        chartReady.value = false;
        dataLoaded.value = false;
      }
    },
    { immediate: true }
  );
  watch(
    () => props.paramNames,
    (newValue) => {
      if (newValue && Object.keys(newValue).length > 0) {
        if (!selectedParam.value || !newValue[selectedParam.value]) {
          selectedParam.value = Object.keys(newValue)[0];
        }
      }
    },
    { immediate: true }
  );
  watch(
    selectedParam,
    (newValue) => {
      if (newValue && props.paramNames[newValue]) {
        updateChartOption();
      }
    },
    { immediate: true }
  );
</script>
<style scoped>
  .chart {
    height: 500px;
    width: 100%;
  }
  .p-select-list,
  .p-select {
    @apply !bg-white !text-black;
  }
</style>
