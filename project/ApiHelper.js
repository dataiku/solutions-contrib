import axios_ from "axios";

const mode = process.env.NODE_ENV;

let baseURLVite = import.meta.env.BASE_URL;

baseURLVite = baseURLVite.replace("5173", process.env.FLASK_RUN_PORT);


const axios = axios_.create({
    baseURL: mode === "production" ?  getWebAppBackendUrl('') : baseURLVite,
});

axios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
})

export let APIErrors = [];

export default axios;