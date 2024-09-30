<template>
  <div class="rounded-lg bg-white p-6 shadow-lg mt-6">
    <h2 class="mb-4 text-2xl font-semibold text-gray-700">Data Chart</h2>
    <div class="mb-4">
      <label for="paramSelect" class="mr-2">Select Parameter:</label>
      <select v-model="selectedParam" id="paramSelect" class="p-2 border rounded">
        <option v-for="param in availableParams" :key="param" :value="param">
          {{ param }}
        </option>
      </select>
    </div>
    <client-only>
      <v-chart class="chart" :option="chartOption" autoresize />
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
import VChart from 'vue-echarts';

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
    required: true
  }
});

const selectedParam = ref('discharge');

const availableParams = computed(() => {
  if (props.hourlyData.length === 0) return [];
  return Object.keys(props.hourlyData[0]).filter(key => 
    typeof props.hourlyData[0][key] === 'number' && 
    key !== 'id' && 
    key !== 'stationId'
  );
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

const chartOption = computed(() => {
  if (props.hourlyData.length === 0) return {};

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

  return {
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
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>