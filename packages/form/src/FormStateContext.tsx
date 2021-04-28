import React, { createContext, useContext, useReducer } from 'react';

const FormStateContext = createContext(null);

const SET = 'SET';
const DELETE = 'DELETE';

const initialState = {};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case SET: {
      return { [payload.key]: payload.data };
    }
    case DELETE: {
      return { ...state, [payload.key]: undefined };
    }
    default: {
      throw new Error(`Fant ikke type: ${type}`);
    }
  }
};

export const FormStateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <FormStateContext.Provider value={value}>{children}</FormStateContext.Provider>;
};

export const useFormStateContext = () => {
  const context = useContext(FormStateContext);
  if (context === undefined) throw new Error('Fant ikke context');
  return context;
};

export default FormStateContext;
