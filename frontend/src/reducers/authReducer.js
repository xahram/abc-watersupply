import produce from "immer";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
} from "../actions/authActions";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log(action);
      return produce(state, (draft) => {
        draft.isAuthenticated = true;
        draft.loading = false;
        draft.user = action.payload.user;
      });

    case LOGIN_FAILURE:
      return produce(state, (draft) => {
        draft.isAuthenticated = false;
        draft.loading = false;
        draft.user = null;
      });
    case LOGIN_REQUEST:
      return produce(state, (draft) => {
        draft.loading = true;
      });
    default:
      return state;
  }
};

export default authReducer;
