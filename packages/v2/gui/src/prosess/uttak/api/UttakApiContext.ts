import { createContext, useContext } from 'react';
import type { UttakBackendApiType } from './UttakBackendApiType.js';

export const UttakApiContext = createContext<UttakBackendApiType | null>(null);

export const useUttakApi = (): UttakBackendApiType => {
  const context = useContext(UttakApiContext);
  if (!context) {
    throw new Error('useUttakApi må brukes innenfor en UttakApiContext');
  }
  return context;
};
