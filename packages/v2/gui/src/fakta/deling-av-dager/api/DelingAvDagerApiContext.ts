import { createContext, useContext } from 'react';
import type { DelingAvDagerApi } from './DelingAvDagerApi.js';

export const DelingAvDagerApiContext = createContext<DelingAvDagerApi | null>(null);

export const useDelingAvDagerApi = (): DelingAvDagerApi => {
  const context = useContext(DelingAvDagerApiContext);
  if (!context) {
    throw new Error('useDelingAvDagerApi må brukes innenfor en DelingAvDagerApiContext');
  }
  return context;
};
