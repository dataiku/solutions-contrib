import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DSSDatasetData, DSSDatasetSchema } from "./backend_model"

function responseDataPromise(request: Promise<AxiosResponse<any, any>>) {
    return new Promise((resolve, reject) => {
        request.then((res) => resolve(res?.data)).catch(reason => reject(reason));
    });
}

export default class ServerApi {
    private static _restApiEndpoint: string | undefined;
    public static client: AxiosInstance;
    public static errors: any[] = [];
    private static initialized = false;

    static set restApiEndpoint(value: string | undefined) {
        this._restApiEndpoint = value;
        this.client = axios.create({ baseURL: value });
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error(error);
                this.errors.push(error.response);
            }
        );
    }


    private static requestWrapper(method: Function) {
        const boundMethod = method.bind(this);
        return async (...args: any[]) => {
            if (!this.client) return;
            return await boundMethod(...args);
        };
    }


    public static init({ restApiEndpoint }: { restApiEndpoint?: string}) {
        if (this.initialized) return;
        if (restApiEndpoint) this.restApiEndpoint = restApiEndpoint;

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
        return this.doGet(`dataset/get/dataset_name=${datasetName}/chunksize=${chunksize}/chunk_index=${chunkIndex}`);
    }

    public static getDatasetSchema(datasetName: string): Promise<DSSDatasetSchema> {
        return this.doGet(`dataset/get_schema/dataset_name=${datasetName}`);
    }
}

ServerApi.init({restApiEndpoint: "http://127.0.0.1:15000/api/"});