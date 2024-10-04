<template>
  <div class="mt-8 rounded-lg bg-white p-8 shadow-lg">
    <h2 class="mb-6 text-2xl font-semibold text-gray-800">Data Visualization</h2>
    <div v-if="hourlyData && hourlyData.length > 0">
      <div class="mb-6 flex items-center">
        <label for="paramSelect" class="mr-4 text-lg font-medium text-gray-700">Select Parameter:</label>
        <Select 
          v-model="selectedParam" 
          :options="availableParams" 
          optionLabel="label" 
          optionValue="value" 
          class="w-full max-w-xs !bg-DarkBlue border-none !text-white" 
        />
      </div>
      <client-only>
        <v-chart v-if="chartReady" class="chart" :option="chartOption" autoresize />
      </client-only>
    </div>
    <div v-else class="flex h-64 items-center justify-center text-lg text-gray-600">
      No data available for the chart.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
]);

const props = defineProps({
  hourlyData: {
    type: Array,
    default: () => []
  }
});

const selectedParam = ref('discharge');
const chartReady = ref(true);

const availableParams = computed(() => {
  if (!props.hourlyData || props.hourlyData.length === 0) return [];
  return Object.keys(props.hourlyData[0])
    .filter(key => 
      typeof props.hourlyData[0][key] === 'number' && 
      key !== 'id' && 
      key !== 'stationId' &&
      key !== 'record'
    )
    .map(key => ({ label: key.split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, c => c.toUpperCase()), value: key }));
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true 
  });
};

const chartOption = shallowRef({});

const updateChartOption = () => {
  if (!props.hourlyData || props.hourlyData.length === 0) return;

  const dates = props.hourlyData.map((item) => formatDate(item.timeStamp));
  const values = props.hourlyData.map((item) => item[selectedParam.value]);

  const units = {
    discharge: 'm³/h',
    totalVolumePerHour: 'm³',
    totalVolumePerDay: 'm³',
    pressure: 'bar',
    cl: 'mg/L',
    turbidity: 'NTU',
    electricConductivity: 'μS/cm'
  };

  chartOption.value = {
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 0,
        interval: 'auto',
        formatter: (value) => {
          return value.split(',')[0] + '\n' + value.split(',')[1];
        },
        margin: 15
      }
    },
    yAxis: {
      type: 'value',
      name: units[selectedParam.value] || '',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 14
      }
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const value = params[0].value;
        const date = params[0].axisValue;
        const paramName = selectedParam.value.split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, c => c.toUpperCase());
        return `<strong>${date}</strong><br/>${paramName}: ${value} ${units[selectedParam.value] || ''}`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    }
  };
};

watch([() => props.hourlyData, selectedParam], () => {
  updateChartOption();
}, { immediate: true });

watch(() => props.hourlyData, (newValue) => {
  if (newValue && newValue.length > 0 && !selectedParam.value) {
    selectedParam.value = availableParams.value[0]?.value || 'discharge';
  }
}, { immediate: true });
</script>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>