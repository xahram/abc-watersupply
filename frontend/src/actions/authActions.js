import { errorNotify, successNotify } from "../utils/alerts/alerts";
import authService from "../services/auth.service";
import { LOCALSTORAGE_ACCESS_TOKEN_NAME } from "../config/index";

export const LOGIN_REQUEST = "login-request";
export const LOGIN_SUCCESS = "login-success";
export const LOGIN_FAILURE = "login-failure";

export const UPDATE_PASSWORD = "update-password";

export function login(email, password) {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const user = await authService.login({ email, password });
      console.log("[authAction.js Line No 14] ", user);
      dispatch({ type: LOGIN_SUCCESS, payload: { user } });
      localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_NAME, user.token);
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}
