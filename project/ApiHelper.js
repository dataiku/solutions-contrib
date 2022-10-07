import axios from "axios";


const mode = process.env.NODE_ENV

axios.defaults.baseURL = mode === "production" ?  getWebAppBackendUrl('') : "http://127.0.0.1:5000";

axios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
})


export let APIErrors = [];

export let API = {}
