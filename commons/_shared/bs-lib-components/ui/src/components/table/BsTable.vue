<template>
    <!-- "update:fetching", "update:rows", "update:columns" -->
    <BsDSSTableFunctional
        v-if="isDSSTable"
        :dss-table-name="dssTableName"
        :batch-size="batchSize"
        :batch-offset="batchOffset"

        @update:fetching="fetching = $event"
        @update:rows="updateRows"
        @update:columns="updateColumns"
    ></BsDSSTableFunctional>
    <QTable
        :dss-table-name="dssTableName"
        :rows="passedRows"
        :columns="passedColumns"

        :filter="filter"
        :filter-method="filterTable"

        :loading="isLoading"
        
        v-bind="$attrs"
    >
        <template #top>
            <div class="bs-dss-table-top-container">
                <span class="dss-table-name">{{ dssTableName }}</span>
                <BsSearchWholeTable
                    v-model="searchedValue"
                    @update:loading="searching = $event"
                ></BsSearchWholeTable>
            </div>
        </template>
        <template v-slot:header="props">
            <BSTableHeader
                :props="props"
            ></BSTableHeader>
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTableColumn, QTable, QTr } from 'quasar';
import BsDSSTableFunctional from "./BsDSSTableFunctional.vue"
import BsSearchWholeTable from "./BsSearchWholeTable.vue"
import BSTableHeader from "./BSTableHeader.vue"
import { filterTable } from './filterTable';

export default defineComponent({
    name: "BsTable",
    components: {
        QTable,
        QTr,
        BsDSSTableFunctional,
        BsSearchWholeTable,
        BSTableHeader,
    },
    emits: ["update:rows", "update:columns"],
    inheritAttrs: false,
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
        loading: {
            type: Boolean,
            default: false
        },
        rows: Array as PropType<Record<string, any>[]>,
        columns: Array as PropType<QTableColumn[]>,
    },
    data() {
        return {
            searching: false,
            fetching: false,
            searchedCol: null as string | null,
            searchedValue: null as string | null,
            _rows: undefined as Record<string, any>[] | undefined,
            _columns: undefined as QTableColumn[] | undefined
        };
    },
    computed: {
        isDSSTable(): boolean {
            return this.dssTableName !== undefined;
        },
        isLoading(): boolean {
            return this.loading || this.searching || this.fetching;
        },
        passedRows(): Record<string, any>[] | undefined {
            return this.isDSSTable ? this._rows : this.rows;
        },
        passedColumns(): QTableColumn[] | undefined {
            return this.isDSSTable ? this._columns : this.columns;
        },
        filter(): { column: string | null, searchVal: string | number | null } {
            return {
                column: this.searchedCol,
                searchVal: this.searchedValue
            };
        },
    },
    methods: {
        updateRows(rows: Record<string, any>[]) {
            this._rows = rows;
            this.$emit("update:rows", this._rows);
        },
        updateColumns(columns: QTableColumn[]) {
            this._columns = columns;
            this.$emit("update:columns", this._columns);
        },
        filterTable(...args: Parameters<typeof filterTable>) {
            return filterTable(...args);
        },
    }
});
</script>

<style lang="scss" scoped>
.dss-table-name {
    font-size: 1.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
}

.bs-dss-table-top-container {
    min-width: 0;
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
}
</style>