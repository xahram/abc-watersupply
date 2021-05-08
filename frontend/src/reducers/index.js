import { combineReducers } from "redux";
import authReducer from "./authReducer";
import customerReducer from "./customerReducer";
import utilityReducer from "./utilityReducer";
import paymentReducer from "./paymentReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  utilities: utilityReducer,
  payments: paymentReducer,
});

export default rootReducer;
