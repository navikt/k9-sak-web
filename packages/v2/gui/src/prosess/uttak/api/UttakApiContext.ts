import { createContext, useContext } from 'react';
import type { BehandlingUttakBackendApiType } from '../BehandlingUttakBackendApiType.js';

export const UttakApiContext = createContext<BehandlingUttakBackendApiType | null>(null);

export const useUttakApi = (): BehandlingUttakBackendApiType => {
  const context = useContext(UttakApiContext);
  if (!context) {
    throw new Error('useUttakApi må brukes innenfor en UttakApiContext');
  }
  return context;
};
