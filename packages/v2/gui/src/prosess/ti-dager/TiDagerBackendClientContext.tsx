import { createContext, useContext } from 'react';
import type { TiDagerBackendApiType } from './TiDagerBackendApiType.js';

export const TiDagerBackendClientContext = createContext<TiDagerBackendApiType | null>(null);

export function useTiDagerBackendClient(): TiDagerBackendApiType {
  const client = useContext(TiDagerBackendClientContext);
  if (client === null) {
    throw new Error('useTiDagerBackendClient must be used within TiDagerBackendClientContext.Provider');
  }
  return client;
}
