<template>
    <div class="bs-grid">
        <div class="bs-grid-header">
            <div class="bs-grid-search-grid-row">
                <q-icon name="search" class="bs-grid-search-icon" />
                <input
                    class="bs-grid-table-search"
                    type="text"
                    v-model="filter"
                    placeholder="Search Items..."
                    style="padding-left: 30px"
                />
            </div>
        </div>
        <div class="ag-theme-alpine" style="height: 100%">
            <ag-grid-vue
                ref="agGrid"
                :columnDefs="columnsDefs"
                :rowData="rows"
                :quickFilterText="filter"
                domLayout="autoHeight"
                :rowHeight="rowHeight"
                :rowSelection="rowSelection"
                :pagination="virtualScroll ? false : true"
                :paginationPageSize="pageSize"
                :rowModelType="virtualScroll ? 'infinite' : 'clientSide'"
                :cacheBlockSize="cacheBlockSize"
                :headerHeight="headerHeight"
                :rowSelectionChanged="onRowSelectionChanged"
                :onGridReady="onGridReady"
            ></ag-grid-vue>
        </div>
    </div>
</template>

<script lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import BSGridHeaderVue from "./BSGridHeader.vue";
import BsGridSearchColVue from "./BsGridSearchCol.vue";

export default {
    name: "BsGrid",
    components: {
        AgGridVue,
        agColumnHeader: BSGridHeaderVue,
        BsGridSearchColVue,
    },
    props: {
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        virtualScroll: {
            type: Boolean,
            default: false,
        },
        classParsed: {
            type: Array,
            default: () => [],
        },
        tableClasses: {
            type: Array,
            default: () => [],
        },
        dssTableName: String,
        title: String,
        // Add other props as needed
    },
    emits: [
        "update:rows",
        "update:columns",
        "update:loading",
        "update:server-side-pagination",
        "virtual-scroll",
    ],
    data() {
        return {
            rowHeight: 36,
            rowSelection: "single",
            pageSize: undefined as undefined | number,
            cacheBlockSize: 100,
            headerHeight: 51,
            columnsDefs: [] as any[],
            filterText: "",
            filter: "",
            // Add other data properties as needed
        };
    },
    methods: {
        onRowSelectionChanged(event: any) {
            console.log("grid onRowSelectionChanged");
            // Handle row selection changed event
        },
        onGridReady(params: any) {
            console.log("grid is ready", params);

            this.autoSizeColumns(params);
            // Handle grid ready event
            this.$emit("update:loading", false);
        },
        autoSizeColumns(params: any) {
            const allColumnIds: any[] = [];
            params.columnApi.getColumns().forEach((column: any) => {
                allColumnIds.push(column.getId());
            });
            params.columnApi.autoSizeColumns(allColumnIds, false);
        },
    },
    mounted() {
        if (this.dssTableName) {
        }
        this.columnsDefs = [
            {
                headerName: this.title,
                children: this.columns,
            },
        ];
        this.$refs.agGrid.gridOptions.defaultColDef = {
            floatingFilterComponent: BsGridSearchColVue,
            floatingFilterComponentParams: { suppressFilterButton: true },
            headerComponentParams: { menuIcon: "tree-down", enableMenu: true },
        };
        // this.columnsDef = this.columns.map((col: any) => {
        //     const agColumn = {
        //         headerName: col.label,
        //         field: col.field,
        //         sortable: col.sortable,
        //         type: col.dataType,
        //         sort: col.sort,
        //         valueFormatter: col.format ? (params: any) => col.format(params.value) : null,
        //     };
        //     return agColumn;
        // })
    },
};
</script>
<style lang="scss" scoped>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
.bs-grid {
    .bs-grid-search-grid-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        justify-content: flex-end;
    }

    .bs-grid-table-search {
        height: 28px;
        padding: 2px 8px;
        border: 1px solid #ccc;
    }

    .bs-grid-search-icon {
        margin-left: 5px;
        cursor: pointer;
        position: relative;
        left: 24px;
    }

    .fa-search {
        color: #777;
    }
    .bs-grid-header {
        width: 100%;
    }
    :deep(.ag-floating-filter){
        padding: 0;
    }
}
</style>
