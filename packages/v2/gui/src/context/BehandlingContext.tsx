import { useContext, createContext, type ReactNode } from 'react';

export interface BehandlingContextType {
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: () => Promise<any>;
}

export const BehandlingContext = createContext<BehandlingContextType | undefined>(undefined);

export const BehandlingProvider = ({
  children,
  behandlingUuid,
  behandlingVersjon,
  refetchBehandling,
}: {
  children: ReactNode;
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: BehandlingContextType['refetchBehandling'];
}) => {
  return (
    <BehandlingContext.Provider value={{ behandlingUuid, behandlingVersjon, refetchBehandling }}>
      {children}
    </BehandlingContext.Provider>
  );
};

export const useRefetchBehandling = (): BehandlingContextType['refetchBehandling'] => {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error('useRefetchBehandling must be used within a BehandlingProvider');
  }
  return context.refetchBehandling;
};

export const useBehandlingContext = (): BehandlingContextType => {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error('useBehandlingContext must be used within a BehandlingProvider');
  }
  return context;
};
