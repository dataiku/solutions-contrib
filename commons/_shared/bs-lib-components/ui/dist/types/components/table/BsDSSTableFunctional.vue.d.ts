import { PropType } from 'vue';
import { QTableColumn } from 'quasar';
import { DSSColumnSchema, DSSDatasetData, RangeFilter } from "../../backend_model";
import { ServerSidePagination } from "./tableHelper";
interface BsTableCol extends QTableColumn {
    dataType?: string;
}
declare const _sfc_main: import("vue").DefineComponent<{
    dssTableName: {
        type: StringConstructor;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    filters: PropType<Record<string, RangeFilter | string[]>>;
}, unknown, {
    DSSColumns: DSSColumnSchema[];
    DSSData: DSSDatasetData;
    fetchingChunk: boolean;
    fetchingSchema: boolean;
}, {}, {
    setFetching({ fetchingChunk, fetchingSchema }: {
        fetchingChunk?: boolean | undefined;
        fetchingSchema?: boolean | undefined;
    }): void;
    setFetchingSchema(fetchingSchema: boolean): void;
    setFetchingChunk(fetchingChunk: boolean): void;
    fetchDSSData(datasetName: string, chunksize?: number | undefined, chunkIndex?: number | undefined): Promise<Record<string, any>[] | undefined>;
    fetchFilteredDSSDataset(datasetName: string, chunksize?: number | undefined, chunk_index?: number | undefined, filters?: Record<string, any[] | RangeFilter> | undefined, groupKeys?: string[] | undefined, groupRows?: string[] | undefined, sortModel?: import("../../backend_model").SortCol[] | undefined, customFilters?: Record<string, import("../../backend_model").CustomFilter | import("../../backend_model").CustomFilter[]> | undefined): Promise<Record<string, any>[] | undefined>;
    fetchDSSColumns(datasetName: string): Promise<{
        columns: BsTableCol[];
        columnsCount: number;
    }>;
    updateColumns(datasetName: string): void;
    updateRows(datasetName: string, chunksize?: number | undefined, chunk_index?: number | undefined, filters?: Record<string, any[] | RangeFilter> | undefined, groupKeys?: string[] | undefined, groupRows?: string[] | undefined, sortModel?: import("../../backend_model").SortCol[] | undefined, customFilters?: Record<string, import("../../backend_model").CustomFilter | import("../../backend_model").CustomFilter[]> | undefined): void;
    parseDSSColumn(columnName: string): string;
    createBsTableCol(options: Partial<BsTableCol>): BsTableCol;
    transformDSSDataToQTableRow(DSSData: DSSDatasetData | string): Record<string, any>[] | undefined;
    updateTableData(): void;
    updateTableDataOnWatchedChanged(newVal?: any, oldVal?: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:rows" | "update:columns" | "update:fetching" | "update:columns-count")[], "update:rows" | "update:columns" | "update:fetching" | "update:columns-count", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dssTableName: {
        type: StringConstructor;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    filters: PropType<Record<string, RangeFilter | string[]>>;
}>> & {
    "onUpdate:rows"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns"?: ((...args: any[]) => any) | undefined;
    "onUpdate:fetching"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns-count"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
