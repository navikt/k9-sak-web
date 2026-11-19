import { createContext, useContext } from 'react';
import type { VergeBackendApiType } from './VergeBackendApiType.js';

export const VergeApiContext = createContext<VergeBackendApiType | null>(null);

export const useVergeApi = (): VergeBackendApiType => {
  const context = useContext(VergeApiContext);
  if (!context) {
    throw new Error('useVergeApi må brukes innenfor en VergeApiContext');
  }
  return context;
};
