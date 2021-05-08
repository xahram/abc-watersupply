import produce from "immer";
import {
  GET_ALL_PAYMENTS_FAILURE,
  GET_ALL_PAYMENTS_SUCCESS,
} from "../actions/paymentActions";

const initialState = {
  totalCustomerPayments: [
    {
      paid: 11,
      dueAmount: 11,
      paymentTime: "1234 2134 234",
    }
  ],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PAYMENTS_SUCCESS:
      return produce(state, (draft) => {
        draft.totalCustomerPayments = action.payload.payments;
        console.log("paymentReducerFile.js ",action.payload)
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
