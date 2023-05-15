<template></template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model"
import { ServerSidePagination } from "./tableHelper";
import { isEqual } from 'lodash';
import { ToBeDefined } from 'app/utils/types';
interface BsTableCol extends QTableColumn {
    dataType?: string,
}

export default defineComponent({
    name: "BsDSSTable",
    props: {
        dssTableName: {
            type: String,
        },
        serverSidePagination: Object as PropType<ServerSidePagination>,
    },
    emits: ["update:fetching", "update:rows", "update:columns", "update:columns-count"],
    data() {
        return {
            DSSColumns: undefined as unknown as ToBeDefined<DSSColumnSchema[]>,
            DSSData: undefined as unknown as ToBeDefined<DSSDatasetData>,
            fetchingChunk: false,
            fetchingSchema: false,
        };
    },
    watch: {
        dssTableName(...args: any[]) {
            this.updateTableDataOnWatchedChanged(...args);
        },
        "serverSidePagination.batchSize"(...args: any[]) {
            this.updateTableDataOnWatchedChanged(...args);
        },
        "serverSidePagination.batchOffset"(...args: any[]) {
            this.updateTableDataOnWatchedChanged(...args);
        },
    },
    methods: {
        setFetching({fetchingChunk, fetchingSchema}: {fetchingChunk?: boolean, fetchingSchema?: boolean}) {
            if (fetchingChunk !== undefined) this.fetchingChunk = fetchingChunk;
            if (fetchingSchema !== undefined) this.fetchingSchema = fetchingSchema;
            const fetching = this.fetchingChunk || this.fetchingSchema;
            this.$emit("update:fetching", fetching);
        },
        setFetchingSchema(fetchingSchema: boolean) {
            this.setFetching({fetchingSchema});
        },
        setFetchingChunk(fetchingChunk: boolean) {
            this.setFetching({fetchingChunk});
        },
        fetchDSSData(...args: Parameters<typeof ServerApi.getDatasetChunk>): Promise<Record<string, any>[] | undefined> {
            return new Promise((resolve, reject) => {
                this.setFetchingChunk(true);
                ServerApi.getDatasetChunk(...args).then((val) => {
                    const data = this.transformDSSDataToQTableRow(val);
                    this.setFetchingChunk(false);
                    resolve(data);
                }).catch(reject);
            })
        },
        fetchDSSColumns(...args: Parameters<typeof ServerApi.getDatasetGenericData>): Promise<{columns: BsTableCol[], columnsCount: number}> {
            this.setFetchingSchema(true);
            return new Promise((resolve, reject) => {
                ServerApi.getDatasetGenericData(...args).then(({ schema, columnsCount }) => {
                    const DSSColumns = schema.columns;
                    const columns = DSSColumns.map(col => this.createBsTableCol({name: col.name, dataType: col.type}));
                    this.setFetchingSchema(false);
                    resolve({ columns, columnsCount });
                }).catch(reject);
            })
        },
        updateColumns(...args: Parameters<typeof ServerApi.getDatasetGenericData>) {
            this.fetchDSSColumns(...args).then(({columns, columnsCount}) => {
                this.$emit("update:columns", columns);
                this.$emit("update:columns-count", columnsCount);
            });
        },
        updateRows(...args: Parameters<typeof ServerApi.getDatasetChunk>) {
            this.fetchDSSData(...args).then(rows => {
                this.$emit("update:rows", rows);
            })
        },
        parseDSSColumn(columnName: string) {
            return columnName === "index" ? "in_dss_index" : columnName;
        },
        
        createBsTableCol(options: Partial<BsTableCol>): BsTableCol {
            const name = options?.name || "default";
            return {
                name,
                label: name,
                field: name,
                sortable: true,
                align: "left",
                ...options
            }
        },

        transformDSSDataToQTableRow(DSSData: DSSDatasetData | string): Record<string, any>[] | undefined {
            if (DSSData === "None") return;
            const entries = Object.entries(DSSData)
            if (!entries?.length) return;

            const rowsAmount = Object.entries(entries[0][1]).length;
            const rows: any[] = Array(rowsAmount).fill(undefined).map((_, index) => {
                return {};
            });
            entries.forEach(([colName, colData]) => {
                colName = this.parseDSSColumn(colName);
                const colValues = Object.values(colData);
                colValues.forEach((val: any, val_index: number) => {
                    const row = rows[val_index];
                    row[colName] = val;
                });
            });
            return rows;
        },
        updateTableData() {
            const {batchSize, batchOffset} = this.serverSidePagination || {}
            if (this.dssTableName && batchSize && (batchOffset !== undefined)) {
                this.updateColumns(this.dssTableName);
                this.updateRows(this.dssTableName, batchSize, batchOffset);
            }
        },

        updateTableDataOnWatchedChanged(newVal?: any, oldVal?: any) {
            if (!isEqual(newVal, oldVal)) this.updateTableData();
        },
    },
    mounted() {
        this.updateTableData();
    },
});
</script>