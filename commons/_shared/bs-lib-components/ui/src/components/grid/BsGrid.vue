<template>
    <div class="bs-grid ag-theme-alpine" style="height: 100%">
        <div class="ag-root-wrapper bs-grid-title">
            {{ title || dssTableName }}
        </div>
        <div v-if="isDataClientSide" class="ag-root-wrapper bs-grid-header">
            <div class="bs-grid-search-grid-row">
                <QInput
                    v-model="filterGridText"
                    class="bs-grid-search"
                    type="text"
                    placeholder="Search Items..."
                    clearable
                >
                    <template #prepend>
                        <q-icon name="search" size="1rem" />
                    </template>
                </QInput>
            </div>
        </div>
        <div class="ag-root-wrapper bs-grid-header" v-if="hasFilters">
            <div class="bs-grid-search-grid-row">
                <QBtn
                    flat
                    no-caps
                    label="Clear Filters"
                    :icon="mdiTrashCanOutline"
                    @click="clearFilters"
                />
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
import { DSSColumnSchema, DSSDatasetGenericData } from "../../backend_model";
import BSGridHeaderVue from "./BsGridHeader.vue";
import BsGridSearchColVue from "./BsGridSearchCol.vue";
import ServerApi from "../../server_api";
import { defineComponent, PropType } from "vue";
import { QIcon, QInput, QBtn } from "quasar";
import { mdiTrashCanOutline } from "@quasar/extras/mdi-v6";

import { RowModelType, BsColDef, DSS_ROW_INDEX } from "./bsGridTypes";
import type { Filters, GridRow } from "../../backend_model";
import { CustomFilterBuilder } from "./CustomFilterBuilder";
import { GridTransformations } from "./GridTransformations";
import {
    Column,
    IServerSideGetRowsParams,
    IServerSideGetRowsRequest,
} from "ag-grid-enterprise";
const LEAF_PREFIX = "leaf";
export default defineComponent({
    name: "BsGrid",
    components: {
        AgGridVue,
        agColumnHeader: BSGridHeaderVue,
        BsGridSearchColVue,
        QInput,
        QIcon,
        QBtn,
    },
    props: {
        columns: {
            type: Array<BsColDef>,
            required: false,
        },
        rows: {
            type: Array as PropType<GridRow[]>,
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
        dssTableName: {
            type: String,
            default: null,
        },
        filters: {
            type: Object as PropType<Filters>,
            default: () => ({}),
        },
        title: {
            type: String,
            default: null,
        },
        rowSelection: {
            type: String,
            default: null,
        },
        groupKeys: {
            type: Array<string>,
            default: () => [],
        },
        groupName: {
            type: String,
            default: null,
        },
        saveSelectionState: {
            type: Boolean,
            default: false,
        },
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
            mdiTrashCanOutline,
            rowHeight: 36,
            headerHeight: 51,
            columnDefs: [] as BsColDef[],
            filterGridText: "",
            datasetColumns: undefined as undefined | BsColDef[],
            datasetRows: undefined as undefined | GridRow[],
            params: undefined as undefined | GridOptions,
            gridApi: undefined as undefined | GridApi,
            autoGroupColumnDef: undefined as undefined | ColDef,
            loading: false,
            rowModelType: this.dssTableName
                ? RowModelType.serverSide
                : RowModelType.clientSide,
            rowData: undefined as undefined | GridRow[],
            dataSource: undefined as undefined | IServerSideDatasource,
            selectionState: {
                selectAllChildren: false,
                toggledNodes: [],
            } as IServerSideGroupSelectionState,
            isComponentAlive: true,
            hasFilters: false,
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
        datasetRows(newVal: GridRow[]) {
            this.$emit("update:rows", newVal);
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
            this.rowData = this.rows?.map((row: GridRow, index: number) => {
                return { ...row, [DSS_ROW_INDEX]: index };
            });
        }
        this.prepareGridColStyle();
    },
    beforeUnmount() {
        this.isComponentAlive = false;
        this.params?.api?.removeEventListener('filterChanged', this.onFilterChanged);

    },
    methods: {
        onFilterChanged() {
            this.hasFilters = this.params?.api?.isAnyFilterPresent() || false;
        },
        updateLoadingState(val: boolean) {
            this.loading = val;
            this.$emit("update:loading", val);
        },
        onGridReady(params: GridReadyEvent) {
            this.params = params;
            this.gridApi = params.api;
            this.params?.api?.addEventListener('filterChanged', this.onFilterChanged);
            this.autoSizeColumns();
            this.updateLoadingState(false);
        },
        autoSizeColumns() {
            const allColumnIds: string[] = [];
            this.params?.columnApi?.getColumns()?.forEach((column: Column) => {
                allColumnIds.push(column.getId());
            });
            this.params!.columnApi!.autoSizeColumns(allColumnIds, false);
        },
        async fetchDatasetColumns() {
            this.updateLoadingState(true);
            try {
                const { schema }: DSSDatasetGenericData =
                    await ServerApi.getDatasetGenericData(this.dssTableName!);
                if (this.isComponentAlive) {
                    this.datasetColumns = schema.columns.map(
                        (col: DSSColumnSchema) =>
                            GridTransformations.createBsGridCol(
                                {
                                    name: col.name,
                                    dataType: col.type,
                                },
                                this.groupKeys
                            )
                    );
                    this.columnDefs = this.datasetColumns;
                }
            } catch (err) {
                this.handleError("Failed to fetch columns: " + err);
            } finally {
                if (this.isComponentAlive) {
                    this.updateLoadingState(false);
                    this.autoSizeColumns();
                }
            }
        },
        handleError(err: string) {
            console.log("got error:", err);
            this.$emit("error", err);
        },
        refreshData() {
            this.gridApi?.refreshServerSide({ route: undefined, purge: true });
        },
        isDoingGrouping(request: IServerSideGetRowsRequest) {
            // we are not doing grouping if at the lowest level
            return request.rowGroupCols.length > request.groupKeys.length;
        },
        currentPageIndex(
            request: IServerSideGetRowsRequest
        ): number | undefined {
            return request.startRow && this.pageSize > 0
                ? request.startRow / this.pageSize
                : undefined;
        },
        createDataSource() {
            return {
                getRows: async (params: IServerSideGetRowsParams) => {
                    this.updateLoadingState(true);
                    try {
                        const req: IServerSideGetRowsRequest = params.request;
                        const customFilters = CustomFilterBuilder.createFilters(
                            req.filterModel
                        );
                        const dssDataset = await ServerApi.getFilteredDataset(
                            this.dssTableName!,
                            this.pageSize,
                            this.currentPageIndex(req),
                            this.filters,
                            this.groupKeys,
                            req.groupKeys,
                            req.sortModel,
                            customFilters
                        );

                        this.datasetRows =
                            GridTransformations.transformDatasetRowsToGridRows(
                                dssDataset,
                                this.datasetColumns as BsColDef[],
                                this.isDoingGrouping(req),
                                this.groupKeys
                            );
                        params.success({ rowData: this.datasetRows });
                    } catch (err) {
                        this.handleError(`Failed to fetch rows: ${err}`);
                        params.fail();
                    } finally {
                        this.updateLoadingState(false);
                        this.autoSizeColumns();
                    }
                },
            };
        },
        getRowId(params: GetRowIdParams): string {
            // Using constant for magic string
            if (params.level > 0) {
                return (
                    LEAF_PREFIX + params.level + "-" + params.data[this.rowId!]
                );
            } else {
                return params.data[this.rowId!];
            }
        },
        prepareGridColStyle() {
            const agGridRef = this.$refs.agGrid as InstanceType<
                typeof AgGridVue
            >;
            agGridRef.gridOptions.defaultColDef = {
                flex: 1,
                headerComponentParams: { enableMenu: true },
                sortable: true,
                filter: true,
                menuTabs: ["filterMenuTab"],
            };
            if (this.groupKeys && this.groupKeys.length >= 1) {
                this.autoGroupColumnDef = {
                    flex: 1,
                    headerName: this.groupName || "Group",
                    field: this.groupKeys[this.groupKeys.length - 1],
                    filter: 'agGroupColumnFilter',
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
        clearFilters() {
            this.params?.api?.setFilterModel(null);
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
