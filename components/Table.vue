<template>
  <div class="container mx-auto">
    <DataTable
      removableSort
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
          <Column
            v-for="(header, index) in headers"
            :key="index"
            :header="header.text"
            :colspan="header.colspan"
            :headerClass="header.class"
          />
        </Row>
        <Row>
          <Column
            v-for="(column, index) in columns"
            :key="index"
            :sortable="column.sortable"
            :field="column.field"
            :headerClass="column.class"
          >
            <template #header>
              <div class="flex flex-col items-center">
                <p class="font-bold">
                  {{ column.header }}
                </p>
                <div v-if="column.unit" class="mt-2 text-base">
                  ({{ column.unit }})
                </div>
              </div>
            </template>
          </Column>
        </Row>
      </ColumnGroup>
      <template #empty>
        <div class="p-4 m-0 text-center text-white bg-DarkBlue">
          No data available
        </div>
      </template>
      <Column
        v-for="(column, index) in columns"
        :key="index"
        :field="column.field"
        :headerClass="column.class"
        :sortable="column.sortable"
      >
        <template #body="slotProps">
          <div class="text-center">
            <component
              :is="column.slot"
              :slotProps="slotProps"
              v-if="column.slot"
            />
            <template v-else-if="column.field === 'status'">
              <div class="status-cell" :class="getStatusClass(slotProps.data[column.field], slotProps.data.timeStamp)">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-2 h-2 rounded-full status-indicator"></div>
                  {{ getDisplayStatus(slotProps.data[column.field], slotProps.data.timeStamp) }}
                </div>
              </div>
            </template>
            <template v-else>
              {{ slotProps.data[column.field] || 0 }}
            </template>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Object,
    default: () => [],
  },
  rows: {
    type: Number,
    default: 10,
  },
  paginator: {
    type: Boolean,
    default: true,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  sortField: {
    type: String,
    default: "station.externalId",
  },
  sortOrder: {
    type: Number,
    default: 1,
  },
  headers: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["row-click"]);

const onRowClick = (event) => {
  if (event.data && event.data.station && event.data.station.id) {
    event.data.stationId = parseInt(event.data.station.id, 10);
  }
  emit("row-click", event);
};

const isDataFresh = (timestamp) => {
  if (!timestamp) return false;
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const dataTime = new Date(timestamp);
  return dataTime > thirtyMinutesAgo;
};

const getDisplayStatus = (status, timestamp) => {
  if (!isDataFresh(timestamp)) {
    return 'OFF';
  }
  return status || 'ON';
};

const getStatusClass = (status, timestamp) => {
  if (!isDataFresh(timestamp)) {
    return 'status-off';
  }
  return status === 'OFF' ? 'status-off' : 'status-on';
};

const paginatorLeft = `Showing max ${props.rows} of ${props.value.length} entries`;
</script>

<style>
.p-datatable-sort-icon {
  @apply !text-white sm:scale-75;
}
.p-datatable tr {
  @apply cursor-pointer !bg-DarkBlue;
}
.p-paginator {
  @apply !bg-DarkBlue !text-white;
}

.p-datatable .p-datatable-tbody > tr.p-row-even {
  @apply !bg-white !text-black;
}
.p-datatable .p-datatable-tbody > tr.p-row-odd {
  @apply !bg-gray-100 !text-black;
}
.p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
  @apply !cursor-pointer !bg-gray-300 !text-black;
}
.p-paginator-rpp-dropdown {
  @apply border-white !bg-DarkNavy !text-white;
}
.p-select-overlay {
  @apply border-white !bg-DarkNavy !text-white hover:!bg-DarkBlue;
}

.status-cell {
  @apply text-nowrap px-4 rounded-lg py-2 !text-center text-xl;
}

.status-on {
  @apply bg-gradient-to-br from-green-50 to-green-100 text-green-800;
}

.status-on .status-indicator {
  @apply h-3 w-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm shadow-green-500/50;
}

.status-off {
  @apply bg-gradient-to-br from-red-50 to-red-100 text-red-800;
}

.status-off .status-indicator {
  @apply h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm shadow-red-500/50;
}
</style>
