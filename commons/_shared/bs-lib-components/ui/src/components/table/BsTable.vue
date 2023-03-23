<template>
    <BsDSSTableFunctional
        v-if="isDSSTable"
        :dss-table-name="dssTableName"
        :server-side-pagination="_serverSidePagination"

        @update:fetching="fetching = $event"
        @update:rows="updateDSSRows"
        @update:columns="updateDSSColumns"
        @update:columns-count="setRecordsCount($event, true)"
    ></BsDSSTableFunctional>
    <QTable
        :rows="passedRows"
        :columns="formattedColumns"

        :filter="filter"
        :filter-method="searchTableFilter"

        :loading="isLoading"
        
        v-bind="$attrs"
    >
        <template #top="{ pagination }">
            <div class="bs-table-top-container">
                <div class="bs-table-name">{{ title || dssTableName || "" }}</div>
                <div class="bs-table-search-container">
                    <BsSearchWholeTable
                        v-model="searchedValue"
                        @update:formatted-value="searchedValueFormatted = $event"
                        @update:loading="searching = $event"
                    ></BsSearchWholeTable>
                    <div :class="['bs-table-clear-all-btn', anyColumnSearched && 'bs-table-clear-all-btn--active']">
                        <q-btn flat round color="primary" :icon="mdiCloseCircleMultiple" @click="clearAllSearch"/>
                    </div>
                </div>
            </div>
            <BsTableServerSidePagination
                :server-side-pagination="_serverSidePagination"
                @update:batch-offset="($event) => {
                    pagination.page = 1;
                    setBatchOffset($event, true);
                }"
            ></BsTableServerSidePagination>
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
                :searched-cols="searchedCols"
                @search-col="updateSearchedCols"
            ></BSTableHeader>
        </template>
        <template #bottom="scope">
            <BsTableBottom
                :scope="scope"
                :server-side-pagination="_serverSidePagination"
                :searching="anyColumnSearched"
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
import { ServerSidePagination } from './tableHelper';
import { isEmpty } from 'lodash';
import { mdiCloseCircleMultiple } from '@quasar/extras/mdi-v6';
import BsTableServerSidePagination from './BsTableServerSidePagination.vue';


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
    BsTableServerSidePagination
},
    emits: ["update:rows", "update:columns", "update:server-side-pagination"],
    inheritAttrs: false,
    props: {
        dssTableName: String,
        title: String,
        serverSidePagination: [Object, Boolean] as PropType<ServerSidePagination | boolean>,
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
            _serverSidePagination: undefined as unknown as ServerSidePagination,
            _rows: undefined as Record<string, any>[] | undefined,
            _columns: undefined as QTableColumn[] | undefined,
            lastBatchIndex: -1,

            mdiCloseCircleMultiple,
        };
    },
    computed: {
        isDSSTable(): boolean {
            return this.dssTableName !== undefined;
        },
        isLoading(): boolean {
            return this.loading || this.searching || this.fetching;
        },
        anyColumnSearched(): boolean {
            return !(!this.searchedValue && isEmpty(this.searchedCols));
        },
        isServerSidePaginationObject(): boolean {
            return typeof this.serverSidePagination !== "boolean";
        },
        passedRows(): Record<string, any>[] | undefined {
            return this.isDSSTable ? this._rows : this.rows;
        },
        passedColumns(): QTableColumn[] | undefined {
            return this.isDSSTable ? this._columns : this.columns;
        },
        formattedColumns(): any[] |undefined {
            if (this.passedColumns) {
                return this.passedColumns.map(col => {
                    return {...col, sortable: false, _sortable: col.sortable};
                })
            }
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
        "serverSidePagination.batchOffset"() {
            this.syncServerSidePagination();
        },
        "serverSidePagination.batchSize"() {
            this.syncServerSidePagination();
        },
        "serverSidePagination.recordsCount"() {
            this.syncServerSidePagination();
        },
    },
    methods: {
        updateDSSRows(rows: Record<string, any>[] | undefined) {
            if (!rows) rows = [];
            const { batchSize, batchOffset } = this._serverSidePagination;
            const fetchedRowsAmount = Object.keys(rows).length;
            if (fetchedRowsAmount < batchSize) {
                const updateObject: Partial<ServerSidePagination> = {};
                updateObject.recordsCount = batchOffset * batchSize + fetchedRowsAmount;
                if (fetchedRowsAmount == 0) {
                    updateObject.batchOffset = batchOffset - 1;
                }
                this.setServerSidePagination(updateObject, true);
            }

            this._rows = rows;
            this.$emit("update:rows", this._rows);
        },
        updateDSSColumns(columns: QTableColumn[]) {
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
        setBatchOffset(batchOffset: number, emit = false) {
            this.setServerSidePagination({batchOffset}, emit);
        },
        setBatchSize(batchSize: number, emit = false) {
            this.setServerSidePagination({batchSize}, emit);
        },
        setRecordsCount(recordsCount: number, emit = false) {
            this.setServerSidePagination({recordsCount}, emit);
        },
        setServerSidePagination(pagination: Partial<ServerSidePagination>, emit = false) {
            pagination = {...pagination};
            Object.entries(pagination).forEach(([key, value]) => {
                if (value < 0) value = 0;
                pagination[key as keyof ServerSidePagination] = value;
                this._serverSidePagination[key as keyof ServerSidePagination] = value;
            })
            if (emit) this.$emit("update:server-side-pagination", pagination);
        },
        syncServerSidePagination() {
            if (this.isServerSidePaginationObject) {
                this.setServerSidePagination(this.serverSidePagination as ServerSidePagination);
            }
        },
        createServerSidePagination() {
            this._serverSidePagination = {
                batchOffset: 0,
                batchSize: 100,
                recordsCount: undefined,
            } as ServerSidePagination;
        },
        clearAllSearch() {
            this.searchedValue = null;
            this.searchedCols = {};
        },
    },

    mounted() {
        if (this.dssTableName || this.serverSidePagination) {
            this.createServerSidePagination();
            this.syncServerSidePagination();
        }
    }
});
</script>

<style lang="scss" scoped>
.bs-table-name {
    font-size: 1.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
}

.bs-table-top-container {
    min-width: 0;
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
}

.bs-table-search-container {
    display: flex;
    .bs-table-clear-all-btn {
        overflow: visible;
        max-width: 0;
        opacity: 0;
        pointer-events: none;

        transition: opacity .5s, max-width .5s;

        &.bs-table-clear-all-btn--active {
            max-width: 30px;
            pointer-events: all;
            opacity: 1;
        }
    }
}
</style>