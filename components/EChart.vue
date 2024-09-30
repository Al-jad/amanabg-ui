<template>
  <div class="rounded-lg bg-white p-6 shadow-lg mt-6">
    <h2 class="mb-4 text-2xl font-semibold text-gray-700">Data Chart</h2>
    <div v-if="hourlyData && hourlyData.length > 0">
      <div class="mb-4">
        <label for="paramSelect" class="mr-2">Select Parameter:</label>
        <Select v-model="selectedParam" :options="availableParams" optionLabel="label" optionValue="value" class="w-full md:w-14rem" />
      </div>
      <client-only>
        <v-chart v-if="chartReady" class="chart" :option="chartOption" autoresize />
      </client-only>
    </div>
    <div v-else class="text-center text-gray-600">
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
      key !== 'stationId'
    )
    .map(key => ({ label: key, value: key }));
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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
      data: dates
    },
    yAxis: {
      type: 'value',
      name: units[selectedParam.value] || '',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 'bold'
      }
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const value = params[0].value;
        const date = params[0].axisValue;
        return `${date}<br/>${selectedParam.value}: ${value} ${units[selectedParam.value] || ''}`;
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
  height: 400px;
}
</style>