<template>
  <div class="container mx-auto">
    <DataTable removableSort
      :value="value"
      class="text-nowrap !bg-DarkBlue"
      :rows="rows"
      :paginator="paginator"
      :scrollable="scrollable"
      :sortField="sortField"
      :sortOrder="sortOrder"
      @row-click="onRowClick"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      paginatorPosition="bottom"
      paginatorClass="justify-content-center"
      :paginatorLeft="paginatorLeft"
    >
      <ColumnGroup type="header">
        <Row>
          <Column v-for="(header, index) in headers" :key="index" :header="header.text" :colspan="header.colspan" :headerClass="header.class" />
        </Row>
        <Row>
          <Column v-for="(column, index) in columns" :key="index" :sortable="column.sortable" :field="column.field" :headerClass="column.class">
            <template #header>
             <div class="flex flex-col items-center">
             <p class="font-bold">
              {{ column.header }}
             </p>
              <div v-if="column.unit" class="mt-2 text-sm">({{ column.unit }})</div>
             </div>
            </template>
          </Column>
        </Row>
      </ColumnGroup>
      <template #empty>
        <div class="m-0 bg-DarkBlue p-4 text-center text-white">No data available</div>
      </template>
      <Column
        v-for="(column, index) in columns"
        :key="index"
        :field="column.field"
        :headerClass="column.class"
        :sortable="column.sortable"
      >
        <template #body="slotProps">
          <component :is="column.slot" :slotProps="slotProps" v-if="column.slot" />
          <template v-else-if="column.field === 'discharge'">
            <span :class="getDischargeColor(slotProps.data[column.field])">
              {{ slotProps.data[column.field] }}
              <span v-html="getDischargeArrow(slotProps.data[column.field])"></span>
            </span>
          </template>
          <template v-else>
            {{ slotProps.data[column.field] }}
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Object,
    default: () => []
  },
  rows: {
    type: Number,
    default: 10
  },
  paginator: {
    type: Boolean,
    default: true
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  sortField: {
    type: String,
    default: 'station.externalId'
  },
  sortOrder: {
    type: Number,
    default: 1
  },
  headers: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['row-click']);

const onRowClick = (event) => {
  if (event.data && event.data.station && event.data.station.id) {
    event.data.stationId = parseInt(event.data.station.id, 10);
  }
  emit('row-click', event);
};

const getDischargeColor = (discharge) => {
  const minDischarge = 10;
  const maxDischarge = 15;
  return discharge < minDischarge || discharge > maxDischarge ? 'text-red-500' : 'text-black';
};

const getDischargeArrow = (discharge) => {
  const minDischarge = 10;
  const maxDischarge = 15;
  return discharge < minDischarge ? '&darr;' : discharge > maxDischarge ? '&uarr;' : '';
};

const paginatorLeft = `Showing max ${props.rows} of ${props.value.length} entries`;

</script>

<style>
.p-datatable-sort-icon {
  @apply !text-white sm:scale-75;
}
.p-datatable tr {
  @apply !bg-DarkBlue cursor-pointer;
}
.p-paginator {
  @apply !bg-DarkBlue !text-white;
}

.wqi-cell {
  @apply flex h-16 w-16 flex-col items-center justify-center rounded-full shadow-sm;
}

.wqi-value {
  @apply text-sm font-bold;
}

.wqi-description {
  @apply text-xs;
}

.excellent {
  @apply bg-gradient-to-br from-blue-400 to-blue-600 text-white;
}
.good {
  @apply bg-gradient-to-br from-green-400 to-green-600 text-white;
}
.fair {
  @apply bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900;
}
.poor {
  @apply bg-gradient-to-br from-orange-400 to-orange-600 text-white;
}
.very-poor {
  @apply bg-gradient-to-br from-red-400 to-red-600 text-white;
}

.p-datatable .p-datatable-tbody > tr.p-row-even {
  @apply !bg-white !text-black;
}
.p-datatable .p-datatable-tbody > tr.p-row-odd {
  @apply !bg-gray-100 !text-black;
}
.p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
  @apply !bg-gray-300 !text-black !cursor-pointer;
}
.p-paginator-rpp-dropdown {
  @apply !bg-DarkNavy !text-white border-white;
}
.p-select-overlay {
  @apply !bg-DarkNavy hover:!bg-DarkBlue !text-white border-white;
}
</style>
