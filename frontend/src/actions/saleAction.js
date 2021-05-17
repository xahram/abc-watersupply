import { errorNotify, successNotify } from "../utils/alerts/alerts";
import saleService from "../services/sale.service";

export const GET_ALL_SALES_SUCCESS = "GET_ALL_SALES_SUCCESS";
export const GET_ALL_SALES_FAILURE = "GET_ALL_SALES_FAILURE";

export function getAllSales() {
  return async (dispatch) => {
    try {
      const { sales } = await saleService.getAllSalesRecord();
      dispatch({
        type: GET_ALL_SALES_SUCCESS,
        payload: {
          sales
        },
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_SALES_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}
