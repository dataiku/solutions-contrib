<template>
    <QTable
        :rows="filteredRows"
        :columns="columns"
        :loading="fetchingData"
        v-bind="$attrs"
    >
        <template #top-right>
            <BsSearchTable
                :columns="colNames"
                :rows="rows"
                v-model="filteredRows"
            ></BsSearchTable>
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTableColumn, QTable } from 'quasar';
import ServerApi from "../../server_api";
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model"
import BsSearchTable from "./BsSearchTable.vue"
export default defineComponent({
    name: "BsTable",
    props: {
        dssTableName: String,
        batchSize: {
            type: Number,
            default: 10,
        },
        batchOffset: {
            type: Number,
            default: 0,
        },
    },
    components: {
        QTable,
        BsSearchTable
    },
    data() {
        return {
            DSSColumns: undefined as unknown as DSSColumnSchema[],
            DSSData: undefined as unknown as DSSDatasetData,
            fetchingChunk: false,
            fetchingSchema: false,
            searchedCol: undefined as string | undefined,
            searchText: null as string | null,
            filteredRows: undefined as Record<string, any>[] | undefined,
        };
    },
    computed: {
        fetchingData(): boolean {
            return this.fetchingChunk || this.fetchingSchema;
        },
        colNames(): string[] | undefined{
            if (!this.DSSColumns) return;
            return this.createColNamesList(this.DSSColumns)
        },
        columns(): QTableColumn[] | undefined {
            if (!this.colNames) return;
            return this.colNames.map(colName => this.createQTableCol(colName))
        },
        rows(): Record<string, any>[] | undefined {
            if (!this.DSSData) return;
            return this.transformDSSDataToQTableRow(this.DSSData)
        },
    },
    methods: {
        updateDSSData(...args: Parameters<typeof ServerApi.getDatasetChunk>) {
            this.fetchingChunk = true;
            ServerApi.getDatasetChunk(...args).then((val) => {
                this.DSSData = val;
                this.fetchingChunk = false;
            });
        },

        getDSSDatasetSchema(...args: Parameters<typeof ServerApi.getDatasetSchema>) {
            this.fetchingSchema = true;
            ServerApi.getDatasetSchema(...args).then((schema) => {
                this.DSSColumns = schema.columns;
                this.fetchingSchema = false;
            });
        },

        parseDSSColumn(columnName: string) {
            return columnName === "id" ? "in_dss_id" : columnName;
        },
        
        // Col slot
        createQTableCol(name: string): QTableColumn {
            return {
                name,
                label: name,
                field: name,
                sortable: true,
                align: "left",
            }
        },

        createColNamesList(schemas: DSSColumnSchema[]): string[] {
            return schemas.map(schema => schema.name);
        },

        transformDSSDataToQTableRow(DSSData: DSSDatasetData) {
            const entries = Object.entries(DSSData)
            if (!entries?.length) return;

            const rowsAmount = Object.entries(entries[0][1]).length;
            const rows: any[] = Array(rowsAmount).fill(undefined).map((_, index) => {
                return {id: index + 1};
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
        }
    },
    async mounted() {
        if (this.dssTableName) {
            this.getDSSDatasetSchema(this.dssTableName)
            this.updateDSSData(this.dssTableName, this.batchSize)
        }
    }
});
</script>