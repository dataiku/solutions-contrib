/* 
 ISSUE : Two axios instances will be used as HTTP client (ServerAPI & axios)
 TODO : Extend server API and use as a global http client 
*/

import axios_ from "axios";
const mode = process.env.NODE_ENV;

let baseURLVite = import.meta.env.BASE_URL;

let localBackendPort = "5000";

try {
  localBackendPort = process.env.FLASK_RUN_PORT;
} catch (error) {
  console.error(error);
}

baseURLVite = baseURLVite.replace("5173", localBackendPort);
const baseURL = mode === "production" ? getWebAppBackendUrl("") : baseURLVite;

const axios = axios_.create({ baseURL });

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
  }
);

export let APIErrors = [];

export default axios;
export { baseURL };
