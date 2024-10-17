<template>
  <div class="mt-8 rounded-lg bg-white p-8 shadow-lg">
    <div v-if="dataLoaded && hourlyData && hourlyData.length > 0">
      <div class="mb-6 flex items-center">
        <label for="paramSelect" class="mr-4 text-lg sm:text-base sm:text-nowrap font-medium">Select Parameter:</label>
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
    <div v-else-if="!dataLoaded" class="flex h-64 items-center justify-center text-lg text-gray-600">
      Loading data...
    </div>
    <div v-else class="flex h-64 items-center justify-center text-lg text-gray-600">
      No data available for the chart.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, shallowRef } from 'vue';
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
  },
  paramNames: {
    type: Object,
    required: true
  },
  selectedParam: {
    type: String,
  },
  units: {
    type: Object,
    default: () => ({})
  }
});

const selectedParam = ref(props.selectedParam);
const chartReady = ref(false);
const dataLoaded = ref(false);

const availableParams = computed(() => {
  return Object.entries(props.paramNames).map(([key, value]) => ({
    label: value.full,
    value: key
  }));
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
  
  
  
  
  

  if (!dataLoaded.value || !props.hourlyData || props.hourlyData.length === 0 || !selectedParam.value) {
    console.warn('Data not ready for chart update');
    chartReady.value = false;
    return;
  }

  // Ensure selectedParam is a valid key in the data
  if (!props.hourlyData[0].hasOwnProperty(selectedParam.value)) {
    console.warn(`Invalid selectedParam: ${selectedParam.value}`);
    // Try to find a valid parameter
    const validParam = Object.keys(props.hourlyData[0]).find(key => key in props.paramNames);
    if (validParam) {
      
      selectedParam.value = validParam;
    } else {
      chartReady.value = false;
      return;
    }
  }

  try {
    const dates = props.hourlyData.map((item) => {
      return item.timeStamp ? formatDate(item.timeStamp) : 'Unknown Date';
    });
    const values = props.hourlyData.map((item) => {
      if (!item) {
        console.warn('Encountered undefined item in hourlyData');
        return null;
      }
      let value = item[selectedParam.value];
      if (value === undefined || value === null) {
        console.warn(`Missing ${selectedParam.value} for item:`, item);
        return null;
      }
      if (selectedParam.value === 'electricConductivity' && value !== null) {
        value = Number((value * 0.65).toFixed(2)); // Convert EC to TDS
      }
      return value;
    });

    
    

    // Filter out null values
    const filteredDates = [];
    const filteredValues = [];
    dates.forEach((date, index) => {
      if (values[index] !== null) {
        filteredDates.push(date);
        filteredValues.push(values[index]);
      }
    });

    
    

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
        data: filteredDates,
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
        name: props.units ? (props.units[selectedParam.value] || '') : '',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14
        }
      },
      series: [
        {
          data: filteredValues,
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
          const paramName = props.paramNames[selectedParam.value]?.full || selectedParam.value;
          const unit = props.units ? (props.units[selectedParam.value] || '') : '';
          let displayValue = value;
          if (selectedParam.value === 'electricConductivity') {
            displayValue = value.toFixed(2); // Ensure TDS is displayed with 2 decimal places
          }
          return `<strong>${date}</strong><br/>${paramName}: ${displayValue} ${unit}`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      }
    };

    chartReady.value = true;
    
  } catch (error) {
    console.error('Error in updateChartOption:', error);
    console.error('Error stack:', error.stack);
    chartReady.value = false;
  }
};

watch([() => props.hourlyData, selectedParam], () => {
  
  updateChartOption();
}, { immediate: true });

watch(() => props.hourlyData, (newValue) => {
  
  if (newValue && newValue.length > 0 && typeof newValue[0] === 'object') {
    dataLoaded.value = true;
    // Ensure a valid parameter is selected
    if (!selectedParam.value || !props.paramNames[selectedParam.value]) {
      selectedParam.value = Object.keys(props.paramNames)[0] || 'discharge';
    }
    updateChartOption();
  } else {
    console.warn('Invalid hourlyData received:', newValue);
    chartReady.value = false;
    dataLoaded.value = false;
  }
}, { immediate: true });

// Ensure selectedParam is always valid
watch(() => props.paramNames, (newValue) => {
  
  if (newValue && Object.keys(newValue).length > 0) {
    if (!selectedParam.value || !newValue[selectedParam.value]) {
      selectedParam.value = Object.keys(newValue)[0];
    }
  }
}, { immediate: true });

// Add this new watch function
watch(() => props.selectedParam, (newValue) => {
  
  if (newValue && props.paramNames[newValue]) {
    selectedParam.value = newValue;
    updateChartOption();
  }
}, { immediate: true });
</script>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>
