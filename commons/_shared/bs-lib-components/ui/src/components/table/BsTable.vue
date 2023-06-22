<template>
    <QTable
        ref="QTableInstance"
        :rows="passedRows"
        :columns="formattedColumns"
        :filter="filter"
        :filter-method="searchTableFilter"
        :loading="isLoading"
        v-bind="$attrs"
        header-align="left"
        :virtual-scroll="virtualScroll"
        :rows-per-page-options="virtualScroll ? [0] : undefined"
        :class="['bs-table', stickyHeader && 'bs-table-sticky']"
        @virtual-scroll="$emit('virtual-scroll', $event)"
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
            ></BSTableHeader>
            <BSTableSearchHeader
                v-if="passedColumns"
                class="bordered"
                :props="props"
                :searched-cols="searchedCols"
                :searched-col="currentlySearchedCol"
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
import { defineComponent } from 'vue';
export default defineComponent({
    inheritAttrs: false,
});
</script>

<script lang="ts" setup>
import { PropType, computed, ref, watch, useSlots, onMounted, Ref } from 'vue';
import { QTableColumn, QTable, QTd, QBtn } from 'quasar';

import BsSearchWholeTable from "./BsSearchWholeTable.vue";
import BSTableHeader from "./BSTableHeader.vue";
import BsTextHighlight from "./BsTextHighlight.vue"
import BsTableBottom from "./BsTableBottom.vue"

import { searchTableFilterFunc } from './filterTable';

import { getObjectPropertyIfExists } from "../../utils/utils"
import { ServerSidePagination } from './tableHelper';
// import isEmpty from 'lodash/isEmpty';
// import isObject from 'lodash/isObject';
import {  isEmpty, isObject } from 'lodash';
import { mdiCloseCircleMultiple } from '@quasar/extras/mdi-v6';
import BsTableServerSidePagination from './BsTableServerSidePagination.vue';
import { BsTableBodyCellProps, QTableBodyCellProps } from './tableTypes';
import { ToBeDefined } from '../../utils/types';
import BSTableSearchHeader from './BSTableSearchHeader.vue';
import { DatasetFetcher, DataBatchFetcher } from './fetchUtils';
import { FetchChunk, FetchDatasetSchema } from "../../backend_model";

const  slots = useSlots();
const emit = defineEmits<{
    (event: "update:rows", rows: Record<string, any>[]): void,
    (event: "update:columns", columns: QTableColumn[]): void,
    (event: "update:loading", loading: boolean): void,
    (event: "update:server-side-pagination", pagination: ServerSidePagination): void,
    (event: "virtual-scroll", details: unknown): void,
}>();
const props = defineProps({
    dssTableName: String,
    title: String,
    serverSidePagination: [Object, Boolean] as PropType<Partial<ServerSidePagination> | boolean>,
    loading: {
        type: Boolean,
        default: false
    },
    rows: Array as PropType<Record<string, any>[]>,
    columns: Array as PropType<QTableColumn[]>,
    "request:data": Object as PropType<
        FetchChunk |
        ((...args: Parameters<FetchChunk>) => Promise<{columns: QTableColumn[], rows: Record<string, any>}>)
    >,
    "request:schema": Object as PropType<FetchDatasetSchema>,
    "is-dataframe": {
        type: Boolean,
        default: true
    },
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
});


const isDSSTable = computed((): boolean => {
    return props.dssTableName !== undefined;
});


const _rows = ref(undefined as Record<string, any>[] | undefined);
const _columns = ref(undefined as QTableColumn[] | undefined);

const passedRows = computed((): Record<string, any>[] | undefined => {
    return isDSSTable.value ? _rows.value : props.rows;
});
const passedColumns = computed((): QTableColumn[] | undefined => {
    return isDSSTable.value ? _columns.value : props.columns;
});

const formattedColumns = computed((): any[] |undefined => {
    if (passedColumns.value) {
        const output = passedColumns.value.map(col => {
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
});
function getColSearchedValue(colName: string) {
    return getObjectPropertyIfExists(searchedCols.value, colName);
}

const passedRowsLength = ref(0);

watch(() => passedRows?.value?.length, (newVal) => {
    if (newVal !== undefined) passedRowsLength.value = newVal;
});
/*
========================
---------search---------
========================
*/
const filter = computed((): { columns: Record<string, string>, searchVal: string | number | null } => {
    return {
        columns: searchedCols.value,
        searchVal: searchedValueFormatted.value
    };
});

const searching = ref(false);

const searchedValue = ref(null as string | null);
const searchedValueFormatted = ref("");

const currentlySearchedCol = ref(null as string | null);

function searchCol(colName: string){
    currentlySearchedCol.value = colName;
}

const searchedCols = ref({} as Record<string, string>);


const anyColumnSearched = computed((): boolean => {
    return !(!searchedValue.value && isEmpty(searchedCols.value));
});



function searchTableFilter(...args: Parameters<typeof searchTableFilterFunc>) {
    return searchTableFilterFunc(...args);
}

function updateSearchedCols(colName: string, searchedVal: string | null) {
    if(searchedVal == null){
        delete searchedCols.value[colName];
        if(colName === currentlySearchedCol.value) currentlySearchedCol.value = null;
    }else{
        searchedCols.value[colName] = searchedVal;
    }
}

function clearAllSearch() {
    searchedValue.value = null;
    currentlySearchedCol.value = null;
    searchedCols.value = {};
}

/*
================================================
---------fetching (data related things)---------
================================================
*/

const dataFetcher = computed(() => {
    const options: any = {
        fetchData: props['request:data'],
    }
    if (isDSSTable) {
        options.datasetName = props.dssTableName!;
        options.fetchSchema = props["request:schema"];
        return new DatasetFetcher(options);
    } else if (props['request:data']) {
        options.type = props['is-dataframe'] ? "DATAFRAME" : "CUSTOM";
        return new DataBatchFetcher(options);
    }
})
const fetching = computed(() => dataFetcher.value?.fetching.value);
const _serverSidePagination = ref(undefined as unknown as ToBeDefined<ServerSidePagination>);

function createServerSidePagination() {
    _serverSidePagination.value = {
        batchOffset: 0,
        batchSize: 100,
        recordsCount: undefined,
    } as ServerSidePagination;
}

function setServerSidePagination(pagination: Partial<ServerSidePagination>, isEmit = false, updateData = true) {
    const changes: Record<string, number> = {};
    
    (Object.entries(pagination)).forEach(([key, value]) => {
        if (value < 0) value = 0;
        if (value !== (_serverSidePagination as Ref<Record<string, number>>).value[key]) {
            changes[key] = value;
            (_serverSidePagination as Ref<Record<string, number>>).value[key] = value;
        }
    })
    
    if (updateData && (changes.hasOwnProperty("batchOffset") || changes.hasOwnProperty("batchSize"))) {
        updateTableData();
    }
    if (isEmit && Object.keys(changes).length) emit("update:server-side-pagination", {..._serverSidePagination.value});
}


function setRows(rows: Record<string, any>[] | undefined) {
    if (!rows) rows = [];
    const { batchSize, batchOffset } = _serverSidePagination.value;
    
    const fetchedRowsAmount = Object.keys(rows).length;
    const updateObject: Partial<ServerSidePagination> = {};
    if (fetchedRowsAmount < batchSize) {
        updateObject.recordsCount = batchOffset * batchSize + fetchedRowsAmount;
        if (fetchedRowsAmount === 0) updateObject.batchOffset = batchOffset - 1;
        setServerSidePagination(updateObject, true, false);
    } 
    if (fetchedRowsAmount) {
        _rows.value = rows;
        emit("update:rows", _rows.value);
    }
}


function setColumns(columns: QTableColumn[]) {
    _columns.value = columns;
    emit("update:columns", _columns.value);
}

function updateTableData() {
    if (_serverSidePagination.value) {
        const {batchOffset, batchSize} = _serverSidePagination.value!;
        dataFetcher.value?.fetchDataFormatted(batchSize, batchOffset).then(res => {
            setRows(res.rows);
            if (!isDSSTable && res.columns) {
                setColumns(res.columns);
            }
        });
        if (isDSSTable) (dataFetcher.value as DatasetFetcher).fetchSchemaFormatted().then(res => {
            console.log(res);
            setColumns(res.columns);
            if (res.columnsCount) setRecordsCount(res.columnsCount!, true, false);
        })
    };
}

function syncServerSidePagination() {
if (isServerSidePaginationObject.value) {
    setServerSidePagination(props.serverSidePagination as ServerSidePagination);
}
}

function setBatchOffset(batchOffset: number, emit = false, updateData = true) {
    setServerSidePagination({batchOffset}, emit, updateData);
    startOfTheTable();
}
function setBatchSize(batchSize: number, emit = false, updateData = true) {
    setServerSidePagination({batchSize}, emit, updateData);
}
function setRecordsCount(recordsCount: number, emit = false, updateData = true) {
    setServerSidePagination({recordsCount}, emit, updateData);
}


const isServerSidePaginationObject = computed((): boolean => {
    return isObject(props.serverSidePagination);
});


watch(() => isServerSidePaginationObject && (props.serverSidePagination as ServerSidePagination).batchOffset, (newVal) => {
    if (typeof newVal == "number") syncServerSidePagination();
})
watch(() => isServerSidePaginationObject && (props.serverSidePagination as ServerSidePagination).batchSize, (newVal) => {
    if (typeof newVal == "number") syncServerSidePagination();
})
watch(() => isServerSidePaginationObject && (props.serverSidePagination as ServerSidePagination).recordsCount, () => {
    syncServerSidePagination();
})



/*
========================
---------Layout---------
========================
*/

const tableEl = ref(undefined as undefined | HTMLElement);
const qTableMiddle = ref(undefined as undefined | HTMLElement);

const QTableInstance = ref<InstanceType<typeof QTable> | null>(null)


function startOfTheTable() {
    if (!props.virtualScroll) QTableInstance.value?.firstPage();
    startOfThePage();
}

function startOfThePage() {
    QTableInstance.value?.scrollTo(0);
}


const colSlotsUsed = computed((): QTableColumn[] | undefined => {
    if (passedColumns.value) {
        return passedColumns.value.filter(col => colBodySlotUsed(col));
    }
});


function getColBodySlot(col: QTableColumn): string {
    return `body-cell-${col.name}`;
}
function colBodySlotUsed(col: QTableColumn): boolean {
    return slots.hasOwnProperty(getColBodySlot(col));
}

function getBodyCellProps(QTableProps: QTableBodyCellProps): BsTableBodyCellProps {
    return {
        ...QTableProps,
        cellValueComponent: BsTextHighlight,
        cellValueComponentProps: {
            queries: [searchedValueFormatted.value, getColSearchedValue(QTableProps.col.name)],
            text: QTableProps.value,
        },
    };
}

const filteredSlots = computed(() => {
    const bsTableCustomSlots = ["top"];
    return Object.fromEntries(
        Object.entries(slots).filter(
            ([slotKey]) => !(bsTableCustomSlots.includes(slotKey) || slotKey.includes("body-cell"))
        )
    );
});


const isLoading = computed((): boolean => {
    return fetching.value || props.loading || searching.value;
});

watch(isLoading, (newVal: boolean) => {
    emit("update:loading", newVal);
});

onMounted(() => {
    if (props.dssTableName || props.serverSidePagination) {
        createServerSidePagination();
        syncServerSidePagination();
        updateTableData();
    }
    passedRowsLength.value = passedRows.value?.length || 0;
    tableEl.value = QTableInstance.value?.$el;
    qTableMiddle.value = tableEl.value?.getElementsByClassName("q-table__middle")[0] as HTMLElement;
});

</script>

<style lang="scss" scoped>

$border-color: #BBBBBB;

@mixin borders-style(){
    border: solid $border-color;
    border-width: 1px 1px 0px 1px;
}
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
            border: solid $border-color;
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
