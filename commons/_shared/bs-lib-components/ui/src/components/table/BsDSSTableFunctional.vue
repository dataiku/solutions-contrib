<script lang="ts">
import { defineComponent } from 'vue';
import { QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model"

export default defineComponent({
    name: "BsDSSTable",
    props: {
        dssTableName: {
            type: String,
        },
        batchSize: {
            type: Number,
        },
        batchOffset: {
            type: Number,
        },
    },
    emts: ["update:fetching", "update:rows", "update:columns"],
    data() {
        return {
            DSSColumns: undefined as unknown as DSSColumnSchema[],
            DSSData: undefined as unknown as DSSDatasetData,
            fetchingChunk: false,
            fetchingSchema: false,
        };
    },
    computed: {
        idOffset(): number {
            const offset = this.batchOffset || 0;
            const size = this.batchSize || 0;
            return offset * size;
        }
    },
    watch: {
        dssTableName(...args: any[]) {
            this.updateTableDataOnWatchedChanged(...args);
        },
        batchSize(...args: any[]) {
            this.updateTableDataOnWatchedChanged(...args);
        },
        batchOffset(...args: any[]) {
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
                    const data = this.transformDSSDataToQTableRow(val, this.idOffset);
                    this.setFetchingChunk(false);
                    resolve(data);
                }).catch(reject);
            })
        },
        fetchDSSColumns(...args: Parameters<typeof ServerApi.getDatasetSchema>): Promise<QTableColumn[]> {
            this.setFetchingSchema(true);
            return new Promise((resolve, reject) => {
                ServerApi.getDatasetSchema(...args).then((schema) => {
                    const DSSColumns = schema.columns;
                    const columns = DSSColumns.map(col => this.createQTableCol(col.name));
                    this.setFetchingSchema(false);
                    resolve(columns);
                }).catch(reject);
            })
        },
        updateColumns(...args: Parameters<typeof ServerApi.getDatasetSchema>) {
            this.fetchDSSColumns(...args).then(columns => {
                this.$emit("update:columns", columns);
            });
        },
        updateRows(...args: Parameters<typeof ServerApi.getDatasetChunk>) {
            this.fetchDSSData(...args).then(rows => {
                this.$emit("update:rows", rows);
            })
        },
        parseDSSColumn(columnName: string) {
            return columnName === "id" ? "in_dss_id" : columnName;
        },
        
        createQTableCol(name: string): QTableColumn {
            return {
                name,
                label: name,
                field: name,
                sortable: false,
                align: "left",
            }
        },

        transformDSSDataToQTableRow(DSSData: DSSDatasetData, idOffset = 0): Record<string, any>[] | undefined {
            const entries = Object.entries(DSSData)
            if (!entries?.length) return;

            const rowsAmount = Object.entries(entries[0][1]).length;
            const rows: any[] = Array(rowsAmount).fill(undefined).map((_, index) => {
                return {id: index + idOffset + 1};
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
            if (this.dssTableName && this.batchSize && (this.batchOffset !== undefined)) {
                this.updateColumns(this.dssTableName);
                this.updateRows(this.dssTableName, this.batchSize, this.batchOffset);
            }
        },
        watchedChanged(newVal?: any, oldVal?: any) {
            return newVal !== oldVal;
        },
        updateTableDataOnWatchedChanged(newVal?: any, oldVal?: any) {
            if (this.watchedChanged(newVal, oldVal)) this.updateTableData();
        },
    },
    mounted() {
        this.updateTableData();
    },
});
</script>