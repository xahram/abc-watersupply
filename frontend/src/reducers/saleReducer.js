import produce from "immer";
import {
  GET_ALL_SALES_FAILURE,
  GET_ALL_SALES_SUCCESS,
} from "../actions/saleAction";

const initialState = {
  totalSales: 0,
  salesList: [],
};

const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SALES_SUCCESS:
      return produce(state, (draft) => {
        draft.salesList = action.payload.sales;
        draft.totalSales = action.payload.sales.length;
      });

    case GET_ALL_SALES_FAILURE:
      return produce(state, (draft) => {
        // Error Handling Here
      });

    default:
      return state;
  }
};

export default saleReducer;
