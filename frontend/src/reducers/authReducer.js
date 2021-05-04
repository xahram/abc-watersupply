import produce from "immer";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "../actions/authActions";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return produce(state, (draft) => {
        draft.isAuthenticated = true;
        draft.user = action.user;
      });

    case LOGIN_FAILURE:
      return produce(state, (draft) => {
        draft.isAuthenticated = false;
        draft.user = null;
      });
    default:
      return state;
  }
};

export default authReducer;
