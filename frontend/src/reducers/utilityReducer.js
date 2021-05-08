

import produce from "immer";
import {
  GET_ALL_UTILITY_FAILURE,
  GET_ALL_UTILITY_SUCCESS,
} from "../actions/utilityActions";

const initialState = {
  subscriptions: [],
  ratelist: [],
  roles: [],
};

const utilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_UTILITY_SUCCESS:
      return produce(state, (draft) => {
        draft.subscriptions = action.payload.subscriptions;
        draft.roles = action.payload.roles;
        draft.ratelist = action.payload.ratelist;
      });

    case GET_ALL_UTILITY_FAILURE:
      return produce(state, (draft) => {
        // Error Handling Here
      });

    default:
      return state;
  }
};

export default utilityReducer;
