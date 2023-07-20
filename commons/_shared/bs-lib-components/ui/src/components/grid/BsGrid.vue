<template>
    <div class="bs-grid ag-theme-alpine" style="height: 100%">
        <!-- <div class="ag-theme-alpine" style="height: 80%;"> -->
        <div class="ag-root-wrapper bs-grid-title">
            {{ title || dssTableName }}
        </div>
        <div class="ag-root-wrapper bs-grid-header">
            <div class="bs-grid-search-grid-row">
                <QInput
                    class="bs-grid-search"
                    type="text"
                    v-model="filter"
                    placeholder="Search Items..."
                    clearable
                >
                    <template #prepend>
                        <q-icon name="search" size="1rem"> </q-icon>
                    </template>
                </QInput>
            </div>
        </div>
        <ag-grid-vue
            style="height: 85%; max-height: 100%"
            ref="agGrid"
            :columnDefs="columnDefs"
            :rowData="dssTableName ? dssRows : rows"
            :quickFilterText="filter"
            domLayouts="autoHeight"
            :rowHeight="rowHeight"
            :rowSelection="rowSelection"
            :pagination="virtualScroll ? false : true"
            :paginationPageSize="pageSize"
            :rowModelType="'clientSide'"
            :cacheBlockSize="cacheBlockSize"
            :headerHeight="headerHeight"
            :rowSelectionChanged="onRowSelectionChanged"
            :groupSelectsChildren="rowSelection === 'multiple'"
            :autoGroupColumnDef="autoGroupColumnDef"
            :onGridReady="onGridReady"
        ></ag-grid-vue>
        <!-- </div> -->
    </div>
</template>

<script lang="ts">
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model";
import BSGridHeaderVue from "./BSGridHeader.vue";
import BsGridSearchColVue from "./BsGridSearchCol.vue";
import ServerApi from "../../server_api";
import { PropType } from "vue";
import { QIcon, QInput } from "quasar";
const MAP_DSS_COL_TYPE_TO_CELL_TYPE = new Map([
    ["string", "text"],
    ["int", "number"],
    ["bigint", "number"],
    ["smallint", "number"],
    ["tinyint", "number"],
    ["float", "number"],
    ["double", "number"],
    ["boolean", "boolean"],
    ["date", "datestring"],
    ["object", "object"],
    ["map", "object"],
    ["array", "object"],
    ["default", "text"],
]);
const MAP_TYPE_TO_FILTER = new Map([
    ["text", "agTextColumnFilter"],
    ["number", "agNumberColumnFilter"],
    ["date", "agDateColumnFilter"],
    ["default", "agTextColumnFilter"],
]);
const MAP_CELL_TYPE_TO_TYPE = new Map([
    ["number", "numericColumn"],
    ["right", "rightAligned"],
    ["left", "leftAligned"],
]);
export default {
    name: "BsGrid",
    components: {
        AgGridVue,
        agColumnHeader: BSGridHeaderVue,
        BsGridSearchColVue,
        QInput,
        QIcon,
    },
    props: {
        columns: {
            type: Array,
            required: false,
        },
        rows: {
            type: Array,
            required: false,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        virtualScroll: {
            type: Boolean,
            default: false,
        },
        pageSize: {
            type: Number,
            default: 100,
        },
        cacheBlockSize: {
            type: Number,
            default: 100,
        },
        dssTableName: String,
        title: String,
        filters: Object as PropType<Record<string, any[]>>,
        rowSelection: {
            type: String,
            default: "single",
        },
        groupKey: String,
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
            headerHeight: 51,
            columnDefs: [] as any[],
            filterText: "",
            filter: "",
            dssColumns: undefined as undefined | Array<any>,
            dssRows: undefined as undefined | Array<any>,
            params: undefined as undefined | any,
            autoGroupColumnDef: null,
            loading: false,
        };
    },
    methods: {
        onRowSelectionChanged(event: any) {
            console.log("grid onRowSelectionChanged");
            // Handle row selection changed event
        },
        onGridReady(params: any) {
            this.params = params;
            this.autoSizeColumns(params);
            this.loading = false;
        },
        autoSizeColumns() {
            const allColumnIds: any[] = [];
            this.params.columnApi.getColumns().forEach((column: any) => {
                allColumnIds.push(column.getId());
            });
            this.params.columnApi.autoSizeColumns(allColumnIds, false);
        },
        createBsGridCol(col: any) {
            const cellDataType =
                MAP_DSS_COL_TYPE_TO_CELL_TYPE.get(col.dataType) ||
                MAP_DSS_COL_TYPE_TO_CELL_TYPE.get("default");
            const type = MAP_CELL_TYPE_TO_TYPE.get(cellDataType!) || [];
            const filter =
                MAP_TYPE_TO_FILTER.get(cellDataType!) ||
                MAP_TYPE_TO_FILTER.get("default");
            return {
                headerName: col.name,
                field: col.name,
                sortable: true,
                // cellDataType,
                type,
                filter: filter,
                dataType: col.dataType,
                rowGroup: col.name === this.groupKey,
                hide: col.name === this.groupKey,
            };
        },
        fetchDSSColumns() {
            this.loading = true;
            ServerApi.getDatasetGenericData(this.dssTableName)
                .then(({ schema }) => {
                    this.dssColumns = schema.columns.map((col) =>
                        this.createBsGridCol({
                            name: col.name,
                            dataType: col.type,
                        })
                    );
                    // this.dssColumns[0] = {
                    //     ...this.dssColumns[0],
                    //     checkboxSelection: this.rowSelection === 'multiple',
                    //     headerCheckboxSelection: this.rowSelection === 'multiple'
                    // };
                    this.columnDefs = this.dssColumns;
                    this.autoSizeColumns();
                })
                .catch((err) =>
                    this.handleError("Failed to fetch columns :" + err)
                )
                .finally(() => {
                    this.loading = false;
                });
        },
        transformDSSRowsToGridRows(dssData: DSSDatasetData | string) {
            let rows = new Array<any>();
            if (dssData === "None") return rows;
            const entries = Object.entries(dssData);
            if (!entries?.length) return rows;
            const nbrRows = Object.entries(entries[0][1]).length;
            for (let i = 0; i < nbrRows; i++) {
                let row = {};
                this.dssColumns.forEach((col) => {
                    row[col.field] = dssData[col.field][i];
                });
                rows.push(row);
            }
            return rows;
        },
        fetchDSSRows() {
            this.loading = true;
            ServerApi.getFilteredDataset(
                this.dssTableName,
                1000000,
                undefined,
                this.filters
            )
                .then((val) => {
                    this.dssRows = this.transformDSSRowsToGridRows(val);
                    this.autoSizeColumns();
                    this.$emit("update:rows", this.dssRows);
                })
                .catch((err) =>
                    this.handleError("Failed to fetch rows :" + err)
                )
                .finally(() => {
                    this.loading = false;
                });
        },
        handleError(err: string) {
            console.log("got error:", err);
            this.$emit("error", err);
        },
    },
    watch: {
        dssColumns(newVal: any[]) {
            if (this.dssTableName) {
                this.fetchDSSRows();
            }
            this.$emit("update:columns", newVal);
        },
        loading(newVal: boolean) {
            this.$emit("update:loading", newVal);
        },
        dssTableName(newVal: string) {
            if (newVal) this.fetchDSSColumns();
        },
        filters() {
            if (this.dssTableName) this.fetchDSSRows();
        },
    },
    mounted() {
        if (this.dssTableName) {
            this.fetchDSSColumns();
        } else {
            this.columnDefs = this.columns;
        }
        this.$refs.agGrid.gridOptions.defaultColDef = {
            // floatingFilter:true,
            // floatingFilterComponent: BsGridSearchColVue,
            floatingFilterComponentParams: { suppressFilterButton: true },
            headerComponentParams: { enableMenu: true },
            menuTabs: ["filterMenuTab"], //if not specified default is : ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab']
            resizable: true,
        };
        this.autoGroupColumnDef = {
            headerName: this.groupKey,
            field: this.groupKey,
            minWidth: 250,
            cellRenderer: "agGroupCellRenderer",
            cellRendererParams: {
                checkbox: true,
            },
            headerCheckboxSelection: this.rowSelection === "multiple",
            headerCheckboxSelectionCurrentPageOnly: true,
        };
    },
};
</script>
<style lang="scss" scoped>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
.ag-theme-alpine {
    --ag-header-background-color: #fff;
    --ag-font-family: 'SourceSansPro';
}
.bs-grid {
    .bs-grid-title {
        font-weight: 600;
        font-size: 16px;
        border-bottom: none;
        height: 51px;
        align-items: center;
        justify-content: center;
    }
    .bs-grid-search-grid-row {
        display: flex;
        align-items: center;
        margin-right: 10px;
        justify-content: flex-end;
    }

    .bs-grid-search {
        height: 28px;
        padding: 2px 8px;
        width: 240px;
        border: 1px solid #ccc;
        :deep(.q-field__control),
        :deep(.q-field__prepend),
        :deep(.q-field__append) {
            height: 100%;
            max-height: 100%;
        }
        :deep(.q-field__control:before) {
            border-bottom: none;
        }
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
        border-bottom: none;
        height: 51px;
        justify-content: center;
    }
    :deep(.ag-floating-filter) {
        padding: 0;
    }
}
</style>
