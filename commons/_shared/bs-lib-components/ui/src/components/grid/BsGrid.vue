<template>
    <div class="bs-grid ag-theme-alpine" style="height: 100%">
        <div class="ag-root-wrapper bs-grid-title">
            {{ title || dssTableName }}
        </div>
        <div class="ag-root-wrapper bs-grid-header">
            <div 
                v-if="isDataClientSide"
                class="bs-grid-search-grid-row"
            >
                <QInput
                    v-model="filterGridText"
                    class="bs-grid-search"
                    type="text"
                    placeholder="Search Items..."
                    clearable
                >
                    <template #prepend>
                        <q-icon 
                            name="search" 
                            size="1rem"
                        />
                    </template>
                </QInput>
            </div>
        </div>
        <ag-grid-vue
            ref="agGrid"
            style="height: 85%; max-height: 100%; width: 100%"
            :column-defs="columnDefs"
            :row-data="!dssTableName ? rowData : null"
            :quick-filter-text="isDataClientSide ? filterGridText : null"
            :row-height="rowHeight"
            :row-selection="rowSelection"
            :row-model-type="rowModelType"
            :get-row-id="getRowId"
            :pagination="virtualScroll ? false : true"
            :pagination-page-size="pageSize"
            :cache-block-size="cacheBlockSize"
            :header-height="headerHeight"
            :group-selects-children="rowSelection === 'multiple'"
            :auto-group-column-def="autoGroupColumnDef"
            :on-grid-ready="onGridReady"
            :server-side-datasource="dataSource"
            paginate-child-rows="true"
        />
    </div>
</template>

<script lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import {
    ColDef,
    GridReadyEvent,
    IServerSideDatasource,
    GridOptions,
    GridApi,
    GetRowIdParams,
    IServerSideGroupSelectionState,
} from "ag-grid-community";
import { DSSColumnSchema } from "../../backend_model";
import BSGridHeaderVue from "./BSGridHeader.vue";
import BsGridSearchColVue from "./BsGridSearchCol.vue";
import ServerApi from "../../server_api";
import { defineComponent, PropType } from "vue";
import { QIcon, QInput } from "quasar";
import {
    RowModelType,
    MAP_DSS_COL_TYPE_TO_CELL_TYPE,
    MAP_TYPE_TO_FILTER,
    MAP_CELL_TYPE_TO_TYPE,
    BsColDef,
} from "./bsGridTypes";
const DSS_ROW_INDEX = "dss-index";
export default defineComponent({
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
            type: Array<any>,
            required: false,
        },
        rows: {
            type: Array as PropType<Record<string, any>>,
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
        rowId: {
            type: String,
            default: DSS_ROW_INDEX,
        },
        dssTableName: String,
        title: String,
        filters: Object as PropType<Record<string, any[]>>,
        rowSelection: String,
        groupKeys: Array<string>,
        groupName: String,
        saveSelectionState: Boolean,
    },
    emits: [
        "update:rows",
        "update:columns",
        "update:loading",
        "update:selection-state",
        "error",
    ],
    data() {
        return {
            rowHeight: 36,
            headerHeight: 51,
            columnDefs: [] as BsColDef[],
            filterGridText: "",
            datasetColumns: undefined as undefined | Array<BsColDef>,
            datasetRows: undefined as undefined | Array<any>,
            params: undefined as undefined | GridOptions,
            gridApi: undefined as undefined | GridApi,
            autoGroupColumnDef: undefined as undefined | ColDef,
            loading: false,
            rowModelType: this.dssTableName
                ? RowModelType.serverSide
                : RowModelType.clientSide,
            rowData: undefined as undefined | Array<Record<string, any>>,
            dataSource: undefined as undefined | IServerSideDatasource,
            selectionState: {
                selectAllChildren: false,
                toggledNodes: [],
            } as IServerSideGroupSelectionState,
        };
    },
    computed: {
        isDataClientSide(): boolean {
            return this.rowModelType === RowModelType.clientSide;
        },
    },
    watch: {
        datasetColumns(newVal: BsColDef[]) {
            this.$emit("update:columns", newVal);
        },
        datasetRows(newVal: any[]) {
            this.$emit("update:rows", newVal);
        },
        loading(newVal: boolean) {
            this.$emit("update:loading", newVal);
        },
        dssTableName() {
            this.fetchDatasetColumns();
            this.rowModelType = RowModelType.serverSide;
        },
        filters() {
            if (this.dssTableName) this.refreshData();
        },
        saveSelectionState() {
            this.selectionState =
                this.gridApi?.getServerSideSelectionState() as IServerSideGroupSelectionState;
            this.$emit("update:selection-state", this.selectionState);
        },
    },
    mounted() {
        if (this.dssTableName) {
            this.fetchDatasetColumns();
            this.dataSource = this.createDataSource();
        } else {
            this.columnDefs = this.columns!;
            this.rowData = this.rows?.map(
                (row: Record<string, any>, index: number) => {
                    return { ...row, [DSS_ROW_INDEX]: index };
                }
            );
        }
        this.prepareGridColStyle();
    },
    methods: {
        onGridReady(params: GridReadyEvent) {
            this.params = params;
            this.gridApi = params.api;
            this.autoSizeColumns();
            this.loading = false;
        },
        autoSizeColumns() {
            const allColumnIds: string[] = [];
            this.params!.columnApi!.getColumns()?.forEach((column: any) => {
                allColumnIds.push(column.getId());
            });
            this.params!.columnApi!.autoSizeColumns(allColumnIds, false);
        },
        isGroupKey(name: string): boolean {
            return (this.groupKeys || []).indexOf(name) >= 0;
        },
        createBsGridCol(col: {name: string, dataType: string}): BsColDef {
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
                type,
                filter: filter,
                dataType: col.dataType,
                rowGroup: this.isGroupKey(col.name),
                hide: this.isGroupKey(col.name),
            };
        },
        fetchDatasetColumns() {
            this.loading = true;
            ServerApi.getDatasetGenericData(this.dssTableName!)
                .then(({ schema }) => {
                    this.datasetColumns = schema.columns.map(
                        (col: DSSColumnSchema) =>
                            this.createBsGridCol({
                                name: col.name,
                                dataType: col.type,
                            })
                    );
                    this.columnDefs = this.datasetColumns;
                    this.autoSizeColumns();
                })
                .catch((err) =>
                    this.handleError("Failed to fetch columns :" + err)
                )
                .finally(() => {
                    this.loading = false;
                });
        },
        transformDatasetRowsToGridRows(
            datasetData: any | string,
            isGroupRow: boolean
        ) {
            let rows: Record<string, any>[] = [];
            if (datasetData === "None") return rows;
            const entries = Object.entries(datasetData);
            if (!entries?.length) return rows;
            const dataKeys = Object.keys(datasetData[(entries as any)[0][0]]);
            for (let key of dataKeys) {
                let row: Record<string, any> = {};
                this.datasetColumns?.forEach((col: any) => {
                    const isGroupHeaderCol =
                        isGroupRow && this.isGroupKey(col.field);
                    if (isGroupHeaderCol || !isGroupRow) {
                        row[col.field!] = datasetData[col.field][key];
                    } else {
                        row[col.field!] = null;
                    }
                    row[DSS_ROW_INDEX] = key;
                });
                rows.push(row);
            }
            return rows;
        },
        handleError(err: string) {
            console.log("got error:", err);
            this.$emit("error", err);
        },
        refreshData() {
            this.gridApi!.refreshServerSide({ route: undefined, purge: true });
        },
        isDoingGrouping(request: any) {
            // we are not doing grouping if at the lowest level
            return request.rowGroupCols.length > request.groupKeys.length;
        },
        currentPageIndex(request: any): number | undefined {
            return request.startRow && this.pageSize > 0
                ? request.startRow / this.pageSize
                : undefined;
        },
        createDataSource() {
            return {
                // called by the grid when more rows are required
                getRows: (params: any) => {
                    // get data for request from server
                    this.loading = true;
                    const req = params.request;
                    const pageIndex = this.currentPageIndex(req);
                    ServerApi.getFilteredDataset(
                        this.dssTableName!,
                        this.pageSize,
                        pageIndex,
                        this.filters,
                        this.groupKeys,
                        req.groupKeys
                    )
                        .then((val: any) => {
                            this.datasetRows =
                                this.transformDatasetRowsToGridRows(
                                    val,
                                    this.isDoingGrouping(req)
                                );
                            params.success({
                                rowData: this.datasetRows,
                            });
                            this.autoSizeColumns();
                        })
                        .catch((err: any) => {
                            // inform grid request failed
                            this.handleError("Failed to fetch rows :" + err);
                            params.fail();
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                },
            };
        },
        getRowId(params: GetRowIdParams): string {
            //Return unique Id mandatory for multiple selection
            if (params.level > 0) {
                return "leaf" + params.level + "-" + params.data[this.rowId!];
            } else {
                return params.data[this.rowId!];
            }
        },
        prepareGridColStyle() {
            (this.$refs.agGrid as any).gridOptions.defaultColDef = {
                flex: 1,
                headerComponentParams: { enableMenu: true },
                menuTabs: ["filterMenuTab"],
            };
            if (this.groupKeys && this.groupKeys.length >= 1) {
                this.autoGroupColumnDef = {
                    flex: 1,
                    headerName: this.groupName || "Group",
                    field: "group",
                    hide: true,
                    minWidth: 250,
                    cellRenderer: "agGroupCellRenderer",
                    cellRendererParams: {
                        checkbox: true,
                    },
                    headerCheckboxSelection: this.rowSelection === "multiple",
                    headerCheckboxSelectionCurrentPageOnly: true,
                };
            }
        },
    },
});
</script>
<style lang="scss" scoped>
.ag-theme-alpine {
    --ag-header-background-color: #fff;
    --ag-font-family: "SourceSansPro";
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
