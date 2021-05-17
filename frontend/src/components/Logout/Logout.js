import React from "react";
import { Redirect } from "react-router-dom";
import { LOCALSTORAGE_ACCESS_TOKEN_NAME } from "../../config/index";


export default function Logout() {
  localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
  return <Redirect to="/" />;
}
