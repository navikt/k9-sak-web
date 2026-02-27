import type { ReactNode } from 'react';
import { createContext } from 'react';

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
