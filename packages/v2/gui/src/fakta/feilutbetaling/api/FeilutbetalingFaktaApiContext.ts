import { createContext, useContext } from 'react';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';

export const FeilutbetalingFaktaApiContext = createContext<FeilutbetalingFaktaApi | null>(null);

export const useFeilutbetalingFaktaApi = (): FeilutbetalingFaktaApi => {
  const context = useContext(FeilutbetalingFaktaApiContext);
  if (!context) {
    throw new Error('useFeilutbetalingFaktaApi må brukes innenfor en FeilutbetalingFaktaApiContext.Provider');
  }
  return context;
};
