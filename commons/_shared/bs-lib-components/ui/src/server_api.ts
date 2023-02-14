import axios, { AxiosInstance } from 'axios';
import { DSSDatasetData, DSSDatasetSchema } from "./backend_model"
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

    private static async doPost(url: string, data: any) {
        return (await this.client.post(url, data))?.data;
    }

    private static async doPut(url: string, data: any) {
        return (await this.client.put(url, data))?.data;
    }

    private static async doGet(url: string) {
        return (await this.client.get(url))?.data;
    }

    private static async doDelete(url: string) {
        const msg = await this.client.delete(url);
        return !!msg;
    }

    public static getDatasetChunk(datasetName: string, chunksize = 10000, chunkIndex = 0): Promise<DSSDatasetData> {
        return this.doGet(`dataset/get/dataset_name=${datasetName}/chunksize=${chunksize}/chunk_index=${chunkIndex}`);
    }

    public static getDatasetSchema(datasetName: string): Promise<DSSDatasetSchema> {
        return this.doGet(`dataset/get_params/dataset_name=${datasetName}`);
    }
}

ServerApi.init({restApiEndpoint: "http://127.0.0.1:15000/api/"});