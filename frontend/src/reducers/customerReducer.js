import produce from "immer";
import {
  GET_ALL_CUSTOMERS_FAILURE,
  GET_ALL_CUSTOMERS_SUCCESS,
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_FAILURE
} from "../actions/customerActions";

const initialState = {
  customers: [],
  customerUpdated:false,
  totalCustomers : 0
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CUSTOMERS_SUCCESS:
      return produce(state, (draft) => {
        draft.customers = action.payload.customers;
        draft.totalCustomers = action.payload.customers.length
      });

    case GET_ALL_CUSTOMERS_FAILURE:
      return produce(state, (draft) => {
        // Error Handling Here
      });

    case UPDATE_CUSTOMER:
      return produce(state, (draft) => {
        draft.customerUpdated = true
      });

    case UPDATE_CUSTOMER_FAILURE:
      return produce(state, (draft) => {
        draft.customerUpdated = false
      });

    default:
      return state;
  }
};

export default customerReducer;
