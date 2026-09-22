import { applyMiddleware, combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { thunk } from 'redux-thunk';

const configureStore = () => {
  const enhancer = applyMiddleware(thunk);

  const allReducers = combineReducers({
    form: formReducer,
  });

  const initialState = {};

  return createStore(allReducers, initialState, enhancer);
};

export default configureStore;
