import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

const isDevelopment = process.env.NODE_ENV === 'development';

const configureStore = () => {
  const middleware = [thunkMiddleware];
  let enhancer;
  if (isDevelopment) {
    const logger = createLogger();
    middleware.push(logger);

    /* eslint-disable-next-line no-underscore-dangle */
    const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const allReducers = combineReducers({
    form: formReducer,
  });

  const initialState = {};

  return createStore(allReducers, initialState, enhancer);
};

export default configureStore;
