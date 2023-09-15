<template>
    <BsDSSTableFunctional
        v-if="isDSSTable"
        :dss-table-name="dssTableName"
        :server-side-pagination="_serverSidePagination"
        :filters="filters"
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
        header-align="left"
        :virtual-scroll="virtualScroll"
        :rows-per-page-options="virtualScroll ? [0] : undefined"
        :class="[...classParsed, ...tableClasses]"
        @virtual-scroll="onVirtualScroll"
        v-model:selected="selected"
        :selection="selection"
        :row-key="rowKey"
    >
        <template #top>
            <div class="bs-table-top-container bs-table-name bordered">
                <slot v-if="$slots.title" name="title"></slot>
                <span v-else>
                    {{ title || dssTableName || "" }}
                </span>
            </div>
            <div class="bs-table-search-container bordered">
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
            <BsTableServerSidePagination
                v-if="_serverSidePagination && serverSidePaginationControls && passedColumns"
                :server-side-pagination="_serverSidePagination"
                @update:batch-offset="setBatchOffset($event, true)"
                class="bordered"
            ></BsTableServerSidePagination>
            <div class="bs-table-top-slot-container bordered">
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
        <template v-slot:body-cell-clearAllCol="props">
            <q-td :props="props">
                <div class="my-table-details">
                </div>
            </q-td>
        </template>
        <template #header="props">
            <BSTableHeader
                v-if="passedColumns"
                :props="props"
                @search-col="searchCol"
                @select-all="selectAllHandler"
                :loading="isLoading"
                :selection="selection"
                :all-selected="allSelectedBatch"
            ></BSTableHeader>
            <BSTableSearchHeader
                v-if="passedColumns"
                class="bordered"
                :props="props"
                :searched-cols="searchedCols"
                :searched-col="searchedCol"
                :selection-on="selectionOn"
                @search-col="updateSearchedCols"
                @clear-all="clearAllSearch"
            ></BSTableSearchHeader>
        </template>
        <template #bottom="scope">
            <BsTableBottom
                :scope="scope"
                :server-side-pagination="_serverSidePagination"
                :start-of-the-page="startOfThePage"
                :searching="anyColumnSearched"
                :virtual-scroll="virtualScroll"
                :scroll-details="scrollDetails"
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
import { isEmpty, isUndefined } from 'lodash';
import { mdiCloseCircleMultiple } from '@quasar/extras/mdi-v6';
import BsTableServerSidePagination from './BsTableServerSidePagination.vue';
import { BsTableBodyCellProps, QTableBodyCellProps } from './tableTypes';
import { ToBeDefined } from '../../utils/types';
import BSTableSearchHeader from './BSTableSearchHeader.vue';
import { RangeFilter } from '../../backend_model';


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
    BsTableServerSidePagination,
    BSTableSearchHeader
},
    emits: ["update:rows", "update:columns", "update:loading", "update:server-side-pagination", "virtual-scroll", "update:selection"],
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
        filters: Object as PropType<Record<string, string[] | RangeFilter>>,
        selection: {
            type: String as PropType<'single' | 'multiple' | 'none'>,
            default: undefined
        },
        rowKey: String
    },
    data() {
        return {
            searching: false,
            fetching: false,
            searchedCols: {} as Record<string, string>,
            searchedCol: undefined as string | undefined,
            searchedValue: null as string | null,
            searchedValueFormatted: "",
            _serverSidePagination: undefined as unknown as ToBeDefined<ServerSidePagination>,
            _rows: undefined as Record<string, any>[] | undefined,
            _columns: undefined as QTableColumn[] | undefined,
            lastBatchIndex: -1,
            scrollDetails: {from: 0},
            passedRowsLength: 0,
            tableEl: undefined as undefined | HTMLElement,
            mdiCloseCircleMultiple,
            selectedRowsByBatch: {} as Record<number,Record<string, any>[]>,
            selected: [] as Record<string, any>[],
            allSelected: {} as Record<number, boolean| null>,
            prevBatchIndex: 0 as number
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
                const output = this.passedColumns.map(col => {
                    return {...col, sortable: false, _sortable: col.sortable};
                });
                const  clearAllCol = {
                    name: 'clearAllCol', 
                    required: true, label: '', 
                    field: '',
                    sortable: false, 
                    _sortable: false
                };
                output.push(clearAllCol);
                return output;
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
        selectionOn(): boolean{
            return this.selection === 'multiple' || this.selection === 'single';
        },
        allSelectedBatch(): boolean | null{
            return isUndefined(this.allSelected[this.currentBatchIndex]) ? false : this.allSelected[this.currentBatchIndex];
        },
        currentBatchIndex(): number {
            if(this.isLoading) {
                return this.prevBatchIndex;
            }else{
                return this._serverSidePagination?.batchOffset || 0;
            };
        }
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
        isLoading(newVal: boolean){
            this.$emit("update:loading", newVal);
        },
        selected(newVal: Record<string,any>[]){
            this.selectedRowsByBatch[this.currentBatchIndex] = this.passedRows ? this.passedRows.filter(row => newVal.findIndex(el => el[this.rowKey!] === row[this.rowKey!]) >= 0) : [];
            const allSelected = this.selectedRowsByBatch[this.currentBatchIndex]?.length === this.passedRows?.length;
            if(allSelected){
                this.allSelected[this.currentBatchIndex] = true;
            }else if(this.selectedRowsByBatch[this.currentBatchIndex]?.length === 0){
                this.allSelected[this.currentBatchIndex] = false;
            }else{
                this.allSelected[this.currentBatchIndex] = null;
            }
            this.$emit('update:selection', this.selected);
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
        updateSearchedCols(colName: string, searchedVal: string | null) {
            if(searchedVal == null){
                delete this.searchedCols[colName];
                if(colName === this.searchedCol) this.searchedCol = undefined;
            }else{
                this.searchedCols[colName] = searchedVal;
            }
        },
        searchCol(colName: string){
            this.searchedCol = colName;
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
            this.prevBatchIndex = this.currentBatchIndex;
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
            this.searchedCol = undefined;
            this.searchedCols = {};
        },
        onVirtualScroll(details: any) {
            const qTableMiddle = this.tableEl?.getElementsByClassName("q-table__middle")[0] as HTMLElement;
            this.scrollDetails = {...details, scrollHeight: qTableMiddle.scrollHeight - qTableMiddle.clientHeight, scrollTop: qTableMiddle.scrollTop};
            this.$emit("virtual-scroll", this.scrollDetails);
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
        selectAllHandler(checked: boolean) {
            if(checked && this.passedRows && this.allSelectedBatch != null) {
                this.selectedRowsByBatch[this.currentBatchIndex] =  [...this.passedRows];
                this.selected = [...this.selected, ...this.passedRows];
            }else{
                this.selectedRowsByBatch[this.currentBatchIndex] =  [];
                const selected = [] as Record<string, any>[];
                Object.values(this.selectedRowsByBatch).forEach((row: any) => selected.push(...row));
                this.selected = selected;
            };
        }
    },

    mounted() {
        if (this.dssTableName || this.serverSidePagination) {
            this.createServerSidePagination();
            this.syncServerSidePagination();
        }
        this.passedRowsLength = this.passedRows?.length || 0;
        this.tableEl = (this.$refs.qTable as any)?.$el;
    }
});
</script>

<style lang="scss" scoped>

@mixin borders-style(){
    border: solid #BBBBBB;
    border-width: 1px 1px 0px 1px;
}
$border-color: #BBBBBB;
.bs-table-sticky {
    :deep(.q-table__top),
    :deep(.q-table__bottom),
    :deep(thead) tr:first-child th, 
    :deep(thead) tr:last-child th {
        background-color: #fff;
    }
    :deep(.q-table__bottom){
        @include borders-style();
    }
    :deep(.q-table){
        @include borders-style();
        border-top: 0px;
        tbody td{
            height: 36px;
        }
    }
    :deep(thead) {
        tr th {
            position: sticky;
            z-index: 1;
            border: solid #BBBBBB;
            border-width: 1px 0px 1px 0px;
        }
        tr:first-child:not(:last-child) th{
            border-bottom: 0px;
        }
        tr:last-child th {
            /* height of all previous header rows */
            top: 51px;
        }
        tr:first-child th {
            top: 0;
        }
    }
}

.bs-table {
    max-height: 100%;
    :deep(.q-table__top) {
        overflow: hidden;
        padding: 0px;
    }
}

.bs-table-top-slot-container {
    width: 100%;
    border-top-width: 0px !important;
}

.bs-table-name {
    font-size: 1rem;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
}

.bs-table-top-container {
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 41px;
}

.bordered {
    @include borders-style();
}
.bs-table-search-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 50px;
    .bs-table-clear-all-btn {
        overflow: visible;
        max-width: 30px;
        opacity: 0;
        pointer-events: none;
        margin-right: 15px;
        transition: opacity .5s, max-width .5s;

        &.bs-table-clear-all-btn--active {
            pointer-events: all;
            opacity: 1;
        }
    }
}
</style>
