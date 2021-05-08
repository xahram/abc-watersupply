import { errorNotify, successNotify } from "../utils/alerts/alerts";
import paymentService from "../services/payment.service";

export const GET_ALL_PAYMENTS_SUCCESS = "GET_ALL_PAYMENTS_SUCCESS";
export const GET_ALL_PAYMENTS_FAILURE = "GET_ALL_PAYMENTS_FAILURE";

export function getAllPaymentsOfUser(id) {
  return async (dispatch) => {
    try {
      const { payments } = await paymentService.getAllPaymentsForUser(id);
      dispatch({
        type: GET_ALL_PAYMENTS_SUCCESS,
        payload: { payments: payments },
      });
      console.log("[paymentActions.js Line No 15] ", payments);
    } catch (error) {
      dispatch({
        type: GET_ALL_PAYMENTS_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}
