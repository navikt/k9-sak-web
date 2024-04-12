import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunkMiddleware from 'redux-thunk';
import { IS_DEV } from './constants';

const isDevelopment = IS_DEV;

const configureStore = () => {
  const middleware = [thunkMiddleware];
  let enhancer;
  if (isDevelopment) {
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
