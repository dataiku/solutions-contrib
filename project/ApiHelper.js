import axios_ from "axios";


const mode = process.env.NODE_ENV


const axios = axios_.create({
    baseURL: mode === "production" ?  parent.getWebAppBackendUrl('') : "/",
})

axios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
})

export let APIErrors = [];

export default axios;