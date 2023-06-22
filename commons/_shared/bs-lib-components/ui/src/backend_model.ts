import { QTableColumn } from "quasar";

export interface DSSColumnSchema {
    name: string;
    type: string;
}

type JSONPrimitives = string | number | boolean | null

export interface PandasDataframeCol extends Record<`${number}`, JSONPrimitives> {}

export interface DSSDatasetSchema {
    columns: DSSColumnSchema[];
    userModified: boolean;
}

export interface DSSDatasetGenericData {
    schema: DSSDatasetSchema,
    columnsCount: number
}

export interface PandasDataframe extends Record<string, PandasDataframeCol> {}

export type FetchDataframeChunk = (chunkSize?: number, chunkIndex?: number) => Promise<PandasDataframe>;
export type FetchDatasetChunk = (datasetName: string, ...args: Parameters<FetchDataframeChunk>) => Promise<PandasDataframe>;
export type FetchChunk = (...args: Parameters<FetchDataframeChunk> | Parameters<FetchDatasetChunk>) => Promise<PandasDataframe>;
export type FetchDatasetSchema = (datasetName: string) => Promise<DSSDatasetSchema>;
export type FetchDatasetGenericData = (datasetName: string) => Promise<DSSDatasetGenericData>;

export type QTableData = {
    rows: Record<string, any>[],
    columns: QTableColumn[],
}