import axios from "./axios";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["authorization"] = token;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
};



export const removeAuthToken = () => {
  delete axios.defaults.headers.common["authorization"];
};
