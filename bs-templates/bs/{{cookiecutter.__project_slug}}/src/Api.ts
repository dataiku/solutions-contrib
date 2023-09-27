import axios from "./api";

interface HelloResponse {
    key: string;
}


export let API = {
    getHello: () => axios.get<HelloResponse>("/api/hello"),
}