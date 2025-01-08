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
      :lazy="true"
      :totalRecords="totalRecords"
      :loading="loading"
      @page="onPage"
      :first="first"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      :currentPageReportTemplate="currentPageReport"
      paginatorPosition="bottom"
      paginatorClass="justify-content-center"
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
import { computed, ref } from 'vue';

const props = defineProps({
  value: {
    type: Array,
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
  totalRecords: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  first: {
    type: Number,
    default: 0,
  },
  currentPageReport: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["row-click", "page"]);

const onRowClick = (event) => {
  if (event.data && event.data.station && event.data.station.id) {
    event.data.stationId = parseInt(event.data.station.id, 10);
  }
  emit("row-click", event);
};

const onPage = (event) => {
  emit("page", event);
};

const currentPageReport = computed(() => {
  if (!props.currentPageReport) return '';
  const start = props.first + 1;
  const end = Math.min(props.first + props.rows, props.totalRecords);
  return `Showing ${start} to ${end} of ${props.totalRecords} entries`;
});

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

const currentRows = ref(props.rows);
const visiblePages = computed(() => {
  const currentPage = Math.floor(props.first / props.rows) + 1;
  const totalPages = Math.ceil(props.totalRecords / props.rows);
  const delta = 2;
  
  let start = Math.max(currentPage - delta, 1);
  let end = Math.min(currentPage + delta, totalPages);

  if (currentPage <= delta) {
    end = Math.min(2 * delta + 1, totalPages);
  } else if (currentPage >= totalPages - delta) {
    start = Math.max(totalPages - 2 * delta, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const isCurrentPage = (pageNumber) => {
  return Math.floor(props.first / props.rows) + 1 === pageNumber;
};

const onRowsChange = () => {
  emit("page", {
    first: 0,
    rows: currentRows.value,
    pageCount: Math.ceil(props.totalRecords / currentRows.value)
  });
};
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

.p-datatable-loading-overlay {
  @apply !bg-DarkBlue/50;
}

.p-datatable-loading-icon {
  @apply !text-white;
}

.p-paginator .p-paginator-current {
  @apply !text-white;
}

.p-paginator .p-paginator-pages .p-paginator-page {
  @apply !text-white bg-DarkBlue hover:!bg-DarkNavy focus:!bg-DarkNavy;
}
.p-paginator .p-paginator-pages .p-paginator-page-selected {
  @apply !text-white bg-DarkNavy
}

.p-paginator .p-paginator-first,
.p-paginator .p-paginator-prev,
.p-paginator .p-paginator-next,
.p-paginator .p-paginator-last {
  @apply !text-white hover:!bg-DarkBlue/80;
}

.custom-paginator-button {
  @apply px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md 
  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-DarkBlue
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white;
}

.custom-paginator-dropdown {
  @apply px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-DarkBlue cursor-pointer;
}

/* Responsive styles */
@media (max-width: 640px) {
  .custom-paginator-button {
    @apply px-2 py-1;
  }

  .custom-paginator-dropdown {
    @apply px-2 py-1 text-xs;
  }
}
</style>
