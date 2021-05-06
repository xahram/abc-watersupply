import { errorNotify, successNotify } from "../utils/alerts/alerts";
import customersService from "../services/customers.service";

export const GET_ALL_CUSTOMERS_SUCCESS = "GET_ALL_CUSTOMERS_SUCCESS";
export const GET_ALL_CUSTOMERS_FAILURE = "GET_ALL_CUSTOMERS_FAILURE";

export function getAllCustomers() {
  return async (dispatch) => {
    try {
      const customers = await customersService.getAllCustomers();
      dispatch({
        type: GET_ALL_CUSTOMERS_SUCCESS,
        payload: { customers: customers.users },
      });
      console.log("[customerActions.js Line No 13] ", customers);
    } catch (error) {
      dispatch({
        type: GET_ALL_CUSTOMERS_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}
