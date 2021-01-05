import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : null;

const combineAllReducers = (reduxFormReducer, applicationReducers) =>
  combineReducers({
    default: combineReducers(applicationReducers),
    form: reduxFormReducer,
  });

const configureStore = () => {
  const middleware = [thunkMiddleware];
  let enhancer;
  if (isDevelopment) {
    middleware.push(logger.createLogger());
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    /* eslint-enable */
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const allReducers = combineAllReducers(formReducer, reducerRegistry.getReducers());

  const initialState = {};

  const store = createStore(allReducers, initialState, enhancer);

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener(reducers => {
    const newReducers = combineAllReducers(formReducer, reducers);
    store.replaceReducer(newReducers);
  });

  return store;
};

export default configureStore;
