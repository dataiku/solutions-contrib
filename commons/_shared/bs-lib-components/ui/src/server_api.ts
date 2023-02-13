import axios, { AxiosInstance } from 'axios';

export class ServerApi {
    private static _host: string | undefined;
    public static client: AxiosInstance;
    public static errors: any[] = [];
    private static initialized = false;

    static set host(value: string | undefined) {
        this._host = value;
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


    public static init(options?: { host?: string}) {
        if (this.initialized) return;

        if (options) {
            const { host } = options;
            this.host = host;
        }

        this.doDelete = this.requestWrapper(this.doDelete);
        this.doPost = this.requestWrapper(this.doPost);
        this.doGet = this.requestWrapper(this.doGet);
        this.doPut = this.requestWrapper(this.doPut);

        this.initialized = true;
    }

    public static async doPost(url: string, data: any) {
        return (await this.client.post(url, data))?.data;
    }

    public static async doPut(url: string, data: any) {
        return (await this.client.put(url, data))?.data;
    }

    public static async doGet(url: string) {
        return (await this.client.get(url))?.data;
    }

    public static async doDelete(url: string) {
        const msg = await this.client.delete(url);
        return !!msg;
    }
}