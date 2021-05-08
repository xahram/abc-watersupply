import { errorNotify, successNotify } from "../utils/alerts/alerts";
import utilityService from "../services/utility.service";

export const GET_ALL_UTILITY_SUCCESS = "GET_ALL_UTILITY_SUCCESS";
export const GET_ALL_UTILITY_FAILURE = "GET_ALL_UTILITY_FAILURE";

export function getAllUtilities() {
  return async (dispatch) => {
    try {
      const [utilities] = await utilityService.getAllUtilities();
      dispatch({
        type: GET_ALL_UTILITY_SUCCESS,
        payload: {
          subscriptions: utilities.subscriptions,
          roles: utilities.roles,
          ratelist: utilities.ratelist,
        },
      });
      console.log("[utilityActions.js Line No 19] ", utilities);
    } catch (error) {
      dispatch({
        type: GET_ALL_UTILITY_FAILURE,
        payload: { error: error },
      });
      errorNotify(error);
    }
  };
}
