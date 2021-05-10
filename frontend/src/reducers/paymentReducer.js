import produce from "immer";
import {
  GET_ALL_PAYMENTS_FAILURE,
  GET_ALL_PAYMENTS_SUCCESS,
  GET_ALL_USER_PAYMENTS_FAILURE,
  GET_ALL_USER_PAYMENTS_SUCCESS,
} from "../actions/paymentActions";

const initialState = {
  totalCustomerPayments: [],
  allPayments: [],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USER_PAYMENTS_SUCCESS:
      return produce(state, (draft) => {
        draft.totalCustomerPayments = action.payload.payments;
      });

    case GET_ALL_USER_PAYMENTS_FAILURE:
      return produce(state, (draft) => {
        // Error Handling Here
      });

    case GET_ALL_PAYMENTS_SUCCESS:
      return produce(state, (draft) => {
        draft.allPayments = action.payload.allPayments;
      });

    case GET_ALL_PAYMENTS_FAILURE:
      return produce(state, (draft) => {
        // Error Handling Here
      });

    default:
      return state;
  }
};

export default customerReducer;
