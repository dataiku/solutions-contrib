<template>
    <QTable
        :rows="rows"
        :columns="columns"
    >
    <!-- v-bind="$attrs" -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTable, QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model"

export default defineComponent({
    name: "BsTable",
    props: {
        tableName: String,
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
        QTable  
    },
    data() {
        return {
            dssColumns: undefined as unknown as DSSColumnSchema[],
            dssData: undefined as unknown as DSSDatasetData,
        };
    },
    computed: {
        columns(): QTableColumn[] | undefined {
            if (!this.dssColumns) return;
            return this.dssColumns.map(col => this.createQTableColFromDSSCol(col))
        },
        rows(): Record<string, any>[] | undefined {
            if (!this.dssData) return;
            const entries = Object.entries(this.dssData)
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
        },
    },
    methods: {
        getDatasetChunk(...args: Parameters<typeof ServerApi.getDatasetChunk>) {
            return ServerApi.getDatasetChunk(...args);
        },

        getDatasetSchema(...args: Parameters<typeof ServerApi.getDatasetSchema>) {
            return ServerApi.getDatasetSchema(...args)
        },

        parseDSSColumn(columnName: string) {
            return columnName === "id" ? "in_dss_id" : columnName;
        },
        
        createQTableColFromDSSCol({name}: DSSColumnSchema): QTableColumn {
            return {
                name,
                label: name,
                field:name,
                sortable: true,
                align: "left",
            }
        }
    },
    async mounted() {
        if (true) {
            const tableName = "movies_data_top_1000";
            this.getDatasetSchema(tableName).then(schema => this.dssColumns = schema.columns);
            this.getDatasetChunk(tableName, this.batchSize).then(val => this.dssData = val);
        }
    }
});
</script>