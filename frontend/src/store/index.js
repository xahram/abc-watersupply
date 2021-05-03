import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { ENABLE_REDUX_LOGGER } from "src/config";
import { createLogger } from "redux-logger";
import rootReducer from "src/reducers";

const loggerMiddleware = createLogger();

export function configureStore(preloadedState = {}) {
  const middlewares = [thunkMiddleware];

  if (ENABLE_REDUX_LOGGER) {
    middlewares.push(loggerMiddleware);
  }

  const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares)
  );

  const enhancers = [middlewareEnhancer];

  const composedEnhancers = compose(...enhancers);
  
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
