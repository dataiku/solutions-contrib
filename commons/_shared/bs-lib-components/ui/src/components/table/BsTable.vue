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
        ref="qTable"
        :rows="passedRows"
        :columns="formattedColumns"

        :filter="filter"
        :filter-method="searchTableFilter"

        :loading="isLoading"
        
        v-bind="$attrs"

        :virtual-scroll="virtualScroll"
        :rows-per-page-options="virtualScroll ? [0] : undefined"
        :class="[...classParsed, ...tableClasses]"
        @virtual-scroll="onVirtualScroll"
    >
        <template #top>
            <div class="bs-table-top-container">
                <div class="bs-table-name">
                    <slot v-if="$slots.title" name="title"></slot>
                    <span v-else>
                        {{ title || dssTableName || "" }}
                    </span>
                </div>
                <div class="bs-table-search-container">
                    <BsSearchWholeTable
                        v-if="globalSearch"
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
                v-if="_serverSidePagination && serverSidePaginationControls"
                :server-side-pagination="_serverSidePagination"
                @update:batch-offset="setBatchOffset($event, true)"
            ></BsTableServerSidePagination>
            <div v-if="$slots.top" class="bs-table-top-slot-container">
                <slot name="top"></slot>
            </div>
        </template>
        <template #body-cell="props">
            <slot
                v-if="$slots.hasOwnProperty('body-cell')"
                name="body-cell"
                v-bind="getBodyCellProps(props)"
            ></slot>
            <q-td v-else :props="props">
                <BsTextHighlight :queries="[searchedValueFormatted, getColSearchedValue(props.col.name)]" :text="props.value"></BsTextHighlight>
            </q-td>
        </template>
        <template 
            v-for="col in colSlotsUsed"
            #[getColBodySlot(col)]="props"
        >
            <slot
                :name="getColBodySlot(col)"
                v-bind="getBodyCellProps(props)"
            ></slot>
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
                :start-of-the-page="startOfThePage"
                :searching="anyColumnSearched"
                :virtual-scroll="virtualScroll"
                :q-table-middle="(qTableMiddle as HTMLElement)"
                :fetched-rows-length="passedRowsLength"
            ></BsTableBottom>
        </template>
        <template v-for="(_, slot) in filteredSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTableColumn, QTable, QTr, QTd, QBtn } from 'quasar';
import BsDSSTableFunctional from "./BsDSSTableFunctional.vue";
import BsSearchWholeTable from "./BsSearchWholeTable.vue";
import BSTableHeader from "./BSTableHeader.vue";
import BsTextHighlight from "./BsTextHighlight.vue"
import BsTableBottom from "./BsTableBottom.vue"

import { searchTableFilter } from './filterTable';

import { getObjectPropertyIfExists } from "../../utils/utils"
import { ServerSidePagination } from './tableHelper';
import isEmpty from 'lodash/isEmpty';
import { mdiCloseCircleMultiple } from '@quasar/extras/mdi-v6';
import BsTableServerSidePagination from './BsTableServerSidePagination.vue';
import { BsTableBodyCellProps, QTableBodyCellProps } from './tableTypes';
import { ToBeDefined } from 'app/utils/types';


export default defineComponent({
    name: "BsTable",
    components: {
    QTable,
    QTr,
    QTd,
    QBtn,
    BsDSSTableFunctional,
    BsSearchWholeTable,
    BSTableHeader,
    BsTextHighlight,
    BsTableBottom,
    BsTableServerSidePagination
},
    emits: ["update:rows", "update:columns", "update:server-side-pagination", "virtual-scroll"],
    inheritAttrs: false,
    props: {
        dssTableName: String,
        title: String,
        serverSidePagination: [Object, Boolean] as PropType<Partial<ServerSidePagination> | boolean>,
        loading: {
            type: Boolean,
            default: false
        },
        rows: Array as PropType<Record<string, any>[]>,
        columns: Array as PropType<QTableColumn[]>,
        virtualScroll: {
            type: Boolean,
            default: true
        },
        stickyHeader: {
            type: Boolean,
            default: true
        },
        globalSearch: {
            type: Boolean,
            default: true
        },
        serverSidePaginationControls: {
            type: Boolean,
            default: true
        },
        style: [Object, String],
        class: [Array, String] as PropType<string[] | string>,
    },
    data() {
        return {
            searching: false,
            fetching: false,
            searchedCols: {} as Record<string, string>,
            searchedValue: null as string | null,
            searchedValueFormatted: "",
            _serverSidePagination: undefined as unknown as ToBeDefined<ServerSidePagination>,
            _rows: undefined as Record<string, any>[] | undefined,
            _columns: undefined as QTableColumn[] | undefined,
            lastBatchIndex: -1,
            scrollDetails: {from: 0},
            passedRowsLength: 0,
            tableEl: undefined as undefined | HTMLElement,
            qTableMiddle: undefined as undefined | HTMLElement,
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
        colSlotsUsed(): QTableColumn[] | undefined {
            if (this.passedColumns) {
                return this.passedColumns.filter(col => this.colBodySlotUsed(col));
            }
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
        classParsed(): string[] {
            let passedClass = this.class || "";
            if (typeof passedClass === "string") passedClass = [passedClass];
            return passedClass;
        },
        tableClasses(): (string | boolean | undefined)[] {
            const tableClasses = ["bs-table", this.stickyHeader && "bs-table-sticky"];
            return tableClasses;
        },
        filteredSlots() {
            const bsTableCustomSlots = ["top"];
            return Object.fromEntries(
                Object.entries(this.$slots).filter(
                    ([slotKey]) => !(bsTableCustomSlots.includes(slotKey) || slotKey.includes("body-cell"))
                )
            );
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
        "passedRows.length"(newVal: number) {
            this.passedRowsLength = newVal;
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
        colBodySlotUsed(col: QTableColumn): boolean {
            return this.$slots.hasOwnProperty(this.getColBodySlot(col));
        },
        getColBodySlot(col: QTableColumn): string {
            return `body-cell-${col.name}`;
        },
        getColSearchedValue(colName: string) {
            return getObjectPropertyIfExists(this.searchedCols, colName);
        },
        setBatchOffset(batchOffset: number, emit = false) {
            this.setServerSidePagination({batchOffset}, emit);
            this.startOfTheTable();
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
        onVirtualScroll(details: any) {
            this.scrollDetails = details;
            this.$emit("virtual-scroll", details)
        },
        startOfTheTable() {
            if (!this.virtualScroll) this.firstPage();
            this.startOfThePage();
        },
        startOfThePage() {
            this.scrollTo(0);
        },
        firstPage() {
            return (this.$refs.qTable as any).firstPage();
        },
        scrollTo(index: string | number, edge?: "center" | "start" | "end" | "start-force" | "center-force" | "end-force" | undefined) {
            return (this.$refs.qTable as any).scrollTo(index, edge);
        },
        getBodyCellProps(props: QTableBodyCellProps): BsTableBodyCellProps {
            return {
                ...props,
                cellValueComponent: BsTextHighlight,
                cellValueComponentProps: {
                    queries: [this.searchedValueFormatted, this.getColSearchedValue(props.col.name)],
                    text: props.value,
                },
            };
        },
    },

    mounted() {
        if (this.dssTableName || this.serverSidePagination) {
            this.createServerSidePagination();
            this.syncServerSidePagination();
        }
        this.passedRowsLength = this.passedRows?.length || 0;
        this.tableEl = (this.$refs.qTable as any)?.$el;
        this.qTableMiddle = this.tableEl?.getElementsByClassName("q-table__middle")[0] as HTMLElement;
    }
});
</script>

<style lang="scss" scoped>
::v-deep.bs-table-sticky {
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
        background-color: #fff;
    }

    thead tr th {
        position: sticky;
        z-index: 1;
    }

  /* this will be the loading indicator */
    thead tr:last-child th {
        top: 48px;
    }
    /* height of all previous header rows */
    thead tr:first-child th {
        top: 0;
    }
}

::v-deep.bs-table {
    max-height: 100%;

    .q-table__top {
        overflow: hidden;
    }
}

.bs-table-top-slot-container {
    width: 100%;
}

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
