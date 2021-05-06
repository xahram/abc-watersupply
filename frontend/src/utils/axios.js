import axios from "axios";
import { API_BASE_URL, LOCALSTORAGE_ACCESS_TOKEN_NAME } from "../config/index";
const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    if (!localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME))
      return Promise.reject("No AUthentication Token FOund");

    instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME)}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(
      "Axios.js File Line 21",
      response,
      response.status,
      response.statusText
    );

    
    instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME)}`;

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
