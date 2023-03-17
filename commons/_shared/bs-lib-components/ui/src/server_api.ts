import axios_, { AxiosInstance, AxiosResponse } from 'axios';
import { DSSDatasetData, DSSDatasetSchema, DSSDatasetGenericData } from "./backend_model"

// import axios_ from "axios";


const mode = process.env.NODE_ENV;
const isProd = mode === "production";

const baseURLVite = "http://127.0.0.1:15000";

// const axios = axios_.create({
//     baseURL: mode === "production" ?  getWebAppBackendUrl('') : baseURLVite,
// })

// axios.interceptors.response.use((response) => {
//     return response.data
// }, (error) => {
//     APIErrors.push(error.response);
//     return Promise.reject(error);
// })

// export let APIErrors = [];


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

    private static initClient() {
        const serverUrl = isProd ? (window as any).getWebAppBackendUrl('') : baseURLVite;
        this._restApiEndpoint = `${serverUrl}/bs_api/`
        this.client = axios_.create({ baseURL: this._restApiEndpoint });
        
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


    public static init() {
        if (this.initialized) return;
        this.initClient();

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


    public static getDatasetGenericData(datasetName: string): Promise<DSSDatasetGenericData> {
        return this.doGet(`dataset/get_generic_data/dataset_name=${datasetName}`);
    }
}

ServerApi.init();