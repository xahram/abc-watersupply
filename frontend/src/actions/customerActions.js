import { errorNotify, successNotify } from "../utils/alerts/alerts";
import customersService from "../services/customers.service";

export const GET_ALL_CUSTOMERS_SUCCESS = "GET_ALL_CUSTOMERS_SUCCESS";
export const GET_ALL_CUSTOMERS_FAILURE = "GET_ALL_CUSTOMERS_FAILURE";

export const CREATE_CUSTOMER = "CREATE_CUSTOMER";
export const CREATE_CUSTOMER_FAILURE = "CREATE_CUSTOMER_FAILURE";

export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";
export const UPDATE_CUSTOMER_FAILURE = "UPDATE_CUSTOMER_FAILURE";

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
      console.log(error);
    }
  };
}

export function updateCustomer(values) {
  return async (dispatch) => {
    try {
      const customer = await customersService.updateCustomer(values);
      dispatch({
        type: UPDATE_CUSTOMER,
      });
      console.log(
        "[customerActions.js : Update Customer Line No 37] ",
        customer
      );
      successNotify("User Updated Successfully");
    } catch (error) {
      dispatch({
        type: UPDATE_CUSTOMER_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}

export function createCustomer(values) {
  return async (dispatch) => {
    try {
      const customer = await customersService.createCustomer(values);
      dispatch({
        type: CREATE_CUSTOMER,
        payload: {
          customer,
        },
      });
      console.log(
        "[customerActions.js : create Customer Line No 37] ",
        customer
      );
      successNotify("User Created Successfully");
    } catch (error) {
      dispatch({
        type: CREATE_CUSTOMER_FAILURE,
        payload: { error: error },
      });
      errorNotify(error.message);
    }
  };
}
