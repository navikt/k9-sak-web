import { createContext, useContext } from 'react';
import type { NyInntektBackendApiType } from './NyInntektBackendApiType.js';

export const NyInntektApiContext = createContext<NyInntektBackendApiType | null>(null);

export const useNyInntektApi = (): NyInntektBackendApiType => {
  const context = useContext(NyInntektApiContext);
  if (!context) {
    throw new Error('useNyInntektApi må brukes innenfor en NyInntektApiContext');
  }
  return context;
};
