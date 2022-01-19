import { configureStore, createStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

// function* exampleSaga() {
//     console.log('Hello Sagas!');
//     yield 'Hello Sagas!';
// }

// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
// });

// sagaMiddleware.run(rootSaga);

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

// const store = configureStore({
//     reducer: rootReducer,
//     middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware()],
//     store.subscribe(() => {
//         // sjekk om dev miljø
//         console.log("[REDUX]", store.getState());
//     });

export default store;