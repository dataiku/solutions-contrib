import axios_, { AxiosInstance, AxiosResponse } from 'axios';
import { PandasDataframe, DSSDatasetSchema, DSSDatasetGenericData } from "./backend_model"

const mode = process.env.NODE_ENV;
const isProd = mode === "production";
let localBackendPort = "5000"

try {
    localBackendPort = process.env.FLASK_RUN_PORT as string;
} catch (error) {
    console.error(error);
}

const baseURLVite = `http://127.0.0.1:${localBackendPort}`;
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
        const serverUrl = isProd ? (parent as any).getWebAppBackendUrl('') : baseURLVite;
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

    public static getDatasetChunk(datasetName: string, chunksize = 10000, chunkIndex = 0): Promise<PandasDataframe> {
        return this.doPost(`dataset/get`, {
            dataset_name: datasetName,
            chunksize: chunksize,
            chunk_index: chunkIndex,
        });
    } 

    public static getDatasetSchema(datasetName: string): Promise<DSSDatasetSchema> {
        return this.doPost(`dataset/get_schema`,{
            dataset_name: datasetName,
        });
    }


    public static getDatasetGenericData(datasetName: string): Promise<DSSDatasetGenericData> {
        return this.doPost(`dataset/get_generic_data`,{
            dataset_name: datasetName,
        });
    }
}

ServerApi.init();