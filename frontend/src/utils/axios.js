import axios from "axios";
import { API_BASE_URL } from "../config/index";
const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(response, response.status, response.statusText);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
