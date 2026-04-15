import { createContext, useContext } from 'react';
import type { UtenlandsoppholdApi } from './UtenlandsoppholdApi.js';

export const UtenlandsoppholdApiContext = createContext<UtenlandsoppholdApi | null>(null);

export const useUtenlandsoppholdApi = (): UtenlandsoppholdApi => {
  const context = useContext(UtenlandsoppholdApiContext);
  if (!context) {
    throw new Error('useUtenlandsoppholdApi må brukes innenfor en UtenlandsoppholdApiProvider');
  }
  return context;
};
