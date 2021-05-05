import axios from "./axios";
import { LOCALSTORAGE_ACCESS_TOKEN_NAME } from "../config/index";
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_NAME, token);
    axios.defaults.headers.common["authorization"] = token;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
  delete axios.defaults.headers.common["authorization"];
};
