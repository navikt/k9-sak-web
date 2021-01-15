import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : null;

const configureStore = () => {
  const middleware = [thunkMiddleware];
  let enhancer;
  if (isDevelopment) {
    middleware.push(logger.createLogger());

    /* eslint-disable-next-line no-underscore-dangle */
    const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  // NB! IKKE LEGG TIL NYE REDUCERE!
  const allReducers = combineReducers({
    form: formReducer,
  });

  const initialState = {};

  return createStore(allReducers, initialState, enhancer);
};

export default configureStore;
