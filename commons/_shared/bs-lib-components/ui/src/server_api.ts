import axios_, { AxiosInstance, AxiosResponse } from 'axios';
import { DSSDatasetData, DSSDatasetSchema, DSSDatasetGenericData, SortCol, CustomFilter, RangeFilter } from "./backend_model"


function responseDataPromise(request: Promise<AxiosResponse<any, any>>) {
    return new Promise((resolve, reject) => {
        request.then((res) => resolve(res?.data)).catch(reason => reject(reason));
    });
}

export default class ServerApi {
    public static client: AxiosInstance;
    public static errors: any[] = [];

    private static _restApiEndpoint: string | undefined;
    private static initialized = false;

    private static initClient(serverUrl: string) {
        this._restApiEndpoint = serverUrl
        this.client = axios_.create({ baseURL: this._restApiEndpoint });
        
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error(error);
                this.errors.push(error.response);
            }
        );
    }


    private static requestWrapper<T>(method: (...args: any[]) => Promise<T>) {
        const boundMethod = method.bind(this);
        return (...args: any[]) => new Promise((resolve, reject) => {
            if (!this.client) reject("client not set, init servetApi with the backendUrl");
            boundMethod(...args).then(resolve).catch(reject);
        });
    }


    public static init(serverUrl: string) {
        if (this.initialized) return;
        this.initClient(serverUrl);

        this.doDelete = this.requestWrapper(this.doDelete);
        this.doPost = this.requestWrapper(this.doPost);
        this.doGet = this.requestWrapper(this.doGet);
        this.doPut = this.requestWrapper(this.doPut);

        this.initialized = true;
    }

    private static doPost(url: string, data: any): Promise<any> {
        return responseDataPromise(this.client.post(url, data));
    }

    private static doPut(url: string, data: any): Promise<any> {
        return responseDataPromise(this.client.put(url, data));
    }

    private static doGet(url: string): Promise<any> {
        return responseDataPromise(this.client.get(url));
    }

    private static async doDelete(url: string) {
        return new Promise((resolve, reject) => {
            this.client.delete(url)
                .then(msg => resolve(!!msg))
                .catch(reason => reject(reason))
        });
    }

    public static getDatasetChunk(datasetName: string, chunksize = 10000, chunkIndex = 0): Promise<DSSDatasetData> {
        return this.doPost(`bs_api/dataset/get`, {
            dataset_name: datasetName,
            chunksize: chunksize,
            chunk_index: chunkIndex,
        });
    }

    public static getDatasetSchema(datasetName: string): Promise<DSSDatasetSchema> {
        return this.doPost(`bs_api/dataset/get_schema`,{
            dataset_name: datasetName,
        });
    }

    public static getFilteredDataset(
        datasetName: string,
        chunksize: number = 10000,
        chunk_index: number = 0,
        filters?: Record<string, any[]| RangeFilter>,
        groupKeys?: string[],
        groupRows?: string[],
        sortModel?: SortCol[],
        customFilters?: Record<string, CustomFilter| CustomFilter[]>
    ): Promise<DSSDatasetData>{
        return this.doPost(`bs_api/dataset/get_filtered_dataset`,{
            dataset_name: datasetName,
            chunksize,
            chunk_index,
            filters : filters || {},
            group_keys: groupKeys,
            group_rows: groupRows,
            sort_model: sortModel,
            custom_filters: customFilters,
        });
    }

    public static getDatasetGenericData(datasetName: string): Promise<DSSDatasetGenericData> {
        return this.doPost(`bs_api/dataset/get_generic_data`,{
            dataset_name: datasetName,
        });
    }
}

