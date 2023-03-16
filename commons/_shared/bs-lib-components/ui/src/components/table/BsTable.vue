<template>
    <BsDSSTableFunctional
        v-if="isDSSTable"
        :dss-table-name="dssTableName"
        :batch-size="batchSize"
        :batch-offset="_batchOffset"

        @update:fetching="fetching = $event"
        @update:rows="updateRows"
        @update:columns="updateColumns"
    ></BsDSSTableFunctional>
    <QTable
        :dss-table-name="dssTableName"
        :rows="passedRows"
        :columns="passedColumns"

        :filter="filter"
        :filter-method="searchTableFilter"

        :loading="isLoading"
        
        v-bind="$attrs"
    >
        <template #top>
            <div class="bs-dss-table-top-container">
                <span class="dss-table-name">{{ dssTableName }}</span>
                <BsSearchWholeTable
                    v-model="searchedValue"
                    @update:formatted-value="searchedValueFormatted = $event"
                    @update:loading="searching = $event"
                ></BsSearchWholeTable>
            </div>
        </template>
        <template
            v-for="([colSlot, colName]) in colSlots"
            v-slot:[colSlot]="props"
        >
            <q-td :props="props">
                <BsTextHighlight :queries="[searchedValueFormatted, getColSearchedValue(colName)]" :text="props.value"></BsTextHighlight>
            </q-td>
        </template>
        <template #header="props">
            <BSTableHeader
                :props="props"
                @search-col="updateSearchedCols"
                ></BSTableHeader>
        </template>
        <template #bottom="scope">
            <BsTableBottom
                :scope="scope"
                :batch-offset="_batchOffset"
                :batch-size="batchSize"
                :last-batch-index="lastBatchIndex"
                @update:batch-offset="setBatchOffset"
            ></BsTableBottom>
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTableColumn, QTable, QTr } from 'quasar';
import BsDSSTableFunctional from "./BsDSSTableFunctional.vue";
import BsSearchWholeTable from "./BsSearchWholeTable.vue";
import BSTableHeader from "./BSTableHeader.vue";
import BsTextHighlight from "./BsTextHighlight.vue"
import BsTableBottom from "./BsTableBottom.vue"

import { searchTableFilter } from './filterTable';

import { getObjectPropertyIfExists } from "../../utils/utils"

export default defineComponent({
    name: "BsTable",
    components: {
        QTable,
        QTr,
        BsDSSTableFunctional,
        BsSearchWholeTable,
        BSTableHeader,
        BsTextHighlight,
        BsTableBottom,
    },
    emits: ["update:rows", "update:columns", "update:batch-offset"],
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
            searchedCols: {} as Record<string, string>,
            searchedValue: null as string | null,
            searchedValueFormatted: "",
            _rows: undefined as Record<string, any>[] | undefined,
            _columns: undefined as QTableColumn[] | undefined,
            _batchOffset: 0,
            lastBatchIndex: -1,
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
        filter(): { columns: Record<string, string>, searchVal: string | number | null } {
            return {
                columns: this.searchedCols,
                searchVal: this.searchedValueFormatted
            };
        },
        colSlots(): [string, string][] {
            const passedColumns = this.passedColumns || [];
            return passedColumns.map(col => [this.getColBodySlot(col.name), col.name]);
        },
    },
    watch: {
        batchOffset() {
            this.syncBatchOffset();
        }
    },
    methods: {
        updateRows(rows: Record<string, any>[] | undefined) {
            if (!rows) rows = [];
            const rowKeys = Object.keys(rows);
            if (rowKeys.length < this.batchSize) {
                if (rowKeys.length == 0) {
                    this.setBatchOffset(this._batchOffset - 1);
                }
                this.lastBatchIndex = this._batchOffset;
            }
            this._rows = rows;
            this.$emit("update:rows", this._rows);
        },
        updateColumns(columns: QTableColumn[]) {
            this._columns = columns;
            this.$emit("update:columns", this._columns);
        },
        searchTableFilter(...args: Parameters<typeof searchTableFilter>) {
            return searchTableFilter(...args);
        },
        updateSearchedCols(colName: string, searchedVal: string) {
            if (searchedVal) {
                this.searchedCols[colName] = searchedVal;
            }
            if (this.searchedCols.hasOwnProperty(colName)) {
                if (!searchedVal) {
                    delete this.searchedCols[colName];
                }
                this.searchedCols = {...this.searchedCols};
            }
        },
        getColBodySlot(colName: string) {
            return `body-cell-${colName}`;
        },
        getColSearchedValue(colName: string) {
            return getObjectPropertyIfExists(this.searchedCols, colName);
        },
        setBatchOffset(batchOffset: number) {
            if (batchOffset < 0) batchOffset = 0;
            this._batchOffset = batchOffset;
            this.$emit("update:batch-offset", batchOffset);
        },
        syncBatchOffset() {
            this._batchOffset = this.batchOffset;
        },
    },
    mounted() {
        this.syncBatchOffset();
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