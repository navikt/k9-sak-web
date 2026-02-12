import { createContext, useContext, useMemo, type ReactNode } from 'react';
import BehandlingAvregningBackendClient from './AvregningBackendClient.js';

const AvregningBackendClientContext = createContext<BehandlingAvregningBackendClient | null>(null);

export function useAvregningBackendClient(): BehandlingAvregningBackendClient {
  const client = useContext(AvregningBackendClientContext);
  if (client === null) {
    throw new Error('useAvregningBackendClient must be used within AvregningBackendClientProvider');
  }
  return client;
}

interface AvregningBackendClientProviderProps {
  children: ReactNode;
  client: BehandlingAvregningBackendClient;
}

export function AvregningBackendClientProvider({ children, client }: AvregningBackendClientProviderProps) {
  const value = useMemo(() => client, [client]);
  return <AvregningBackendClientContext.Provider value={value}>{children}</AvregningBackendClientContext.Provider>;
}
