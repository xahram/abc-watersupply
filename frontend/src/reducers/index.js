import { combineReducers } from 'redux';
import authReducer from './authReducer';
import customerReducer from './customerReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer
});

export default rootReducer;