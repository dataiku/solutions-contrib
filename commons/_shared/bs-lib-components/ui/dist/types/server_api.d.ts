import { AxiosInstance } from 'axios';
import { DSSDatasetData, DSSDatasetSchema, DSSDatasetGenericData } from "./backend_model";
export default class ServerApi {
    static client: AxiosInstance;
    static errors: any[];
    private static _restApiEndpoint;
    private static initialized;
    private static initClient;
    private static requestWrapper;
    static init(serverUrl: string): void;
    private static doPost;
    private static doPut;
    private static doGet;
    private static doDelete;
    static getDatasetChunk(datasetName: string, chunksize?: number, chunkIndex?: number): Promise<DSSDatasetData>;
    static getDatasetSchema(datasetName: string): Promise<DSSDatasetSchema>;
    static getFilteredDataset(datasetName: string, chunksize: number, chunk_index: number, filters?: Record<string, any[]>): Promise<any>;
    static getDatasetGenericData(datasetName: string): Promise<DSSDatasetGenericData>;
}
