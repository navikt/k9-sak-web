import { useContext, createContext, type ReactNode } from 'react';

export interface BehandlingContextType {
  refetchBehandling: () => Promise<any>;
}

export const BehandlingContext = createContext<BehandlingContextType | undefined>(undefined);

export const BehandlingProvider = ({
  children,
  refetchBehandling,
}: {
  children: ReactNode;
  refetchBehandling: BehandlingContextType['refetchBehandling'];
}) => {
  return <BehandlingContext.Provider value={{ refetchBehandling }}>{children}</BehandlingContext.Provider>;
};

export const useRefetchBehandling = (): BehandlingContextType['refetchBehandling'] => {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error('useRefetchBehandling must be used within a BehandlingProvider');
  }
  return context.refetchBehandling;
};
