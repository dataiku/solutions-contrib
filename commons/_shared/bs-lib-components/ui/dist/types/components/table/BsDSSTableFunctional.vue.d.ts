import { PropType } from 'vue';
import { QTableColumn } from 'quasar';
import { DSSColumnSchema, DSSDatasetData } from "../../backend_model";
import { ServerSidePagination } from "./tableHelper";
interface BsTableCol extends QTableColumn {
    dataType?: string;
}
declare const _sfc_main: import("vue").DefineComponent<{
    dssTableName: {
        type: StringConstructor;
    };
    serverSidePagination: PropType<ServerSidePagination>;
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
    fetchDSSColumns(datasetName: string): Promise<{
        columns: BsTableCol[];
        columnsCount: number;
    }>;
    updateColumns(datasetName: string): void;
    updateRows(datasetName: string, chunksize?: number | undefined, chunkIndex?: number | undefined): void;
    parseDSSColumn(columnName: string): string;
    createBsTableCol(options: Partial<BsTableCol>): BsTableCol;
    transformDSSDataToQTableRow(DSSData: DSSDatasetData | string): Record<string, any>[] | undefined;
    updateTableData(): void;
    watchedChanged(newVal?: any, oldVal?: any): boolean;
    updateTableDataOnWatchedChanged(newVal?: any, oldVal?: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dssTableName: {
        type: StringConstructor;
    };
    serverSidePagination: PropType<ServerSidePagination>;
}>>, {}>;
export default _sfc_main;
