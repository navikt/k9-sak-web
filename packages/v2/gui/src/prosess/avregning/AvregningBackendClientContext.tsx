import { createContext, useContext } from 'react';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';

export const AvregningBackendClientContext = createContext<BehandlingAvregningBackendApiType | null>(null);

export function useAvregningBackendClient() {
  const client = useContext(AvregningBackendClientContext);
  if (client === null) {
    throw new Error('useAvregningBackendClient must be used within AvregningBackendClientContext.Provider');
  }
  return client;
}
