import { createContext, useContext } from 'react';
import type { BarnOmsBackendApiType } from './BarnOmsBackendApiType.js';

export const BarnOmsApiContext = createContext<BarnOmsBackendApiType | null>(null);

export const useBarnOmsApi = (): BarnOmsBackendApiType => {
  const context = useContext(BarnOmsApiContext);
  if (!context) {
    throw new Error('useBarnOmsApi må brukes innenfor en BarnOmsApiContext');
  }
  return context;
};
