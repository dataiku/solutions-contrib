<template></template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue';
import { QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { DSSDatasetData } from "../../backend_model"
import { ServerSidePagination } from "./tableHelper";
// import isEqual from 'lodash/isEqual';
import {isEqual} from 'lodash';
interface BsTableCol extends QTableColumn {
    dataType?: string,
}

const props = defineProps({
    dssTableName: {
        type: String,
    },
    serverSidePagination: Object as PropType<ServerSidePagination>,
});

const emit = defineEmits(["update:fetching", "update:rows", "update:columns", "update:columns-count"]);

const fetchingChunk = ref(false);
const fetchingSchema = ref(false);

watch(() => props.dssTableName, (...args) => {
    updateTableDataOnWatchedChanged(...args);
})
watch(() => props?.serverSidePagination?.batchSize, (...args: any[]) => {
    updateTableDataOnWatchedChanged(...args);
});
watch(() => props?.serverSidePagination?.batchOffset, (...args: any[]) => {
    updateTableDataOnWatchedChanged(...args);
});
function setFetching(fetching: {fetchingChunk?: boolean, fetchingSchema?: boolean}) {
    if (fetching.fetchingChunk !== undefined) fetchingChunk.value = fetching.fetchingChunk;
    if (fetching.fetchingSchema !== undefined) fetchingSchema.value = fetching.fetchingSchema;

    const isFetching = fetchingChunk.value || fetchingSchema.value;
    emit("update:fetching", isFetching);
}
function setFetchingSchema(fetchingSchema: boolean) {
    setFetching({fetchingSchema});
}
function setFetchingChunk(fetchingChunk: boolean) {
    setFetching({fetchingChunk});
}
function fetchDSSData(...args: Parameters<typeof ServerApi.getDatasetChunk>): Promise<Record<string, any>[] | undefined> {
    return new Promise((resolve, reject) => {
        setFetchingChunk(true);
        ServerApi.getDatasetChunk(...args).then((val) => {
            const data = transformDSSDataToQTableRow(val);
            resolve(data);
        }).catch(reject).finally(() => {
            setFetchingChunk(false);
        });
    })
}
function fetchDSSColumns(...args: Parameters<typeof ServerApi.getDatasetGenericData>): Promise<{columns: BsTableCol[], columnsCount: number}> {
    setFetchingSchema(true);
    return new Promise((resolve, reject) => {
        ServerApi.getDatasetGenericData(...args).then(({ schema, columnsCount }) => {
            const DSSColumns = schema.columns;
            const columns = DSSColumns.map(col => createBsTableCol({name: col.name, dataType: col.type}));
            resolve({ columns, columnsCount });
        }).catch(reject).finally(() => {
            setFetchingSchema(false);
        });
    })
}
function updateColumns(...args: Parameters<typeof ServerApi.getDatasetGenericData>) {
    fetchDSSColumns(...args).then(({columns, columnsCount}) => {
        emit("update:columns", columns);
        emit("update:columns-count", columnsCount);
    });
}
function updateRows(...args: Parameters<typeof ServerApi.getDatasetChunk>) {
    fetchDSSData(...args).then(rows => {
        emit("update:rows", rows);
    })
}
function createBsTableCol(options: Partial<BsTableCol>): BsTableCol {
    const name = options?.name || "default";
    return {
        name,
        label: name,
        field: name,
        sortable: true,
        align: "left",
        ...options
    }
}

function transformDSSDataToQTableRow(DSSData: DSSDatasetData | string): Record<string, any>[] | undefined {
    if (DSSData === "None") return;
    const entries = Object.entries(DSSData)
    if (!entries?.length) return;

    const rowsAmount = Object.entries(entries[0][1]).length;
    const rows: any[] = Array(rowsAmount).fill(undefined).map(() => ({}));
    entries.forEach(([colName, colData]) => {
        const colValues = Object.values(colData);
        colValues.forEach((val: any, val_index: number) => {
            const row = rows[val_index];
            row[colName] = val;
        });
    });
    return rows;
}
function updateTableData() {
    const {batchSize, batchOffset} = props.serverSidePagination || {}
    if (props.dssTableName && batchSize && (batchOffset !== undefined)) {
        updateColumns(props.dssTableName);
        updateRows(props.dssTableName, batchSize, batchOffset);
    }
}

function updateTableDataOnWatchedChanged(newVal?: any, oldVal?: any, onCleanup?: any) {
    if (!isEqual(newVal, oldVal)) updateTableData();
}

onMounted(() => {
    updateTableData();
});
</script>