import { createContext, useContext } from 'react';
import type { OmBarnetBackendApiType } from './OmBarnetBackendApiType.js';

export const OmBarnetApiContext = createContext<OmBarnetBackendApiType | null>(null);

export const useOmBarnetApi = (): OmBarnetBackendApiType => {
  const context = useContext(OmBarnetApiContext);
  if (!context) {
    throw new Error('useOmBarnetApi må brukes innenfor en OmBarnetApiContext');
  }
  return context;
};
