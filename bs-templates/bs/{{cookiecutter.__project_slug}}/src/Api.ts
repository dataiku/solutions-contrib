import axios from "./api/index";

interface HelloResponse {
    key: string;
}


export let API = {
    getHello: () => axios.get<HelloResponse>("/api/hello"),
}