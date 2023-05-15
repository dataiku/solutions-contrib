import axios from "../ApiHelper";


export let API = {
    getHello: () => axios.get("/api/hello"),
}