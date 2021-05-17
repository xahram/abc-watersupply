import { combineReducers } from "redux";
import authReducer from "./authReducer";
import customerReducer from "./customerReducer";
import utilityReducer from "./utilityReducer";
import paymentReducer from "./paymentReducer";
import saleReducer from "./saleReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  utilities: utilityReducer,
  payments: paymentReducer,
  sales: saleReducer
});

export default rootReducer;
