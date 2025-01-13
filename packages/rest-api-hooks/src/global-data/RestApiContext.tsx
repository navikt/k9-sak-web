import React, { createContext, useReducer, ReactNode } from 'react';

const defaultInitialState = {};

type Action = { type: 'success'; key: string; data: any } | { type: 'remove'; key: string };
type Dispatch = (action: Action) => void;
type State = { [key: string]: any };

export const RestApiStateContext = createContext<State>(defaultInitialState);
export const RestApiDispatchContext = createContext<Dispatch | undefined>(undefined);

interface OwnProps {
  children: ReactNode;
  initialState?: { [key in string]: any };
}

/**
 * Håndterer state for data som skal hentes fra backend kun en gang og som en trenger aksess til
 * mange steder i applikasjonen.
 */
export const RestApiProvider = ({ children, initialState }: OwnProps): JSX.Element => {
  const [state, dispatch] = useReducer((oldState, action) => {
    switch (action.type) {
      case 'success':
        return {
          ...oldState,
          [action.key]: action.data,
        };
      case 'remove':
        return Object.keys(oldState)
          .filter(key => key !== action.key)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: oldState[key],
            }),
            {},
          );
      default:
        throw new Error();
    }
  }, initialState || defaultInitialState);

  return (
    <RestApiStateContext.Provider value={state}>
      <RestApiDispatchContext.Provider value={dispatch}>{children}</RestApiDispatchContext.Provider>
    </RestApiStateContext.Provider>
  );
};
