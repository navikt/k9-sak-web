import { createContext } from 'react';
import type { ReactNode } from 'react';

export interface BehandlingContextType {
  refetchBehandling: () => Promise<any>;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  refetchBehandling: () => Promise.resolve(null),
});

export const BehandlingProvider = ({
  children,
  refetchBehandling,
}: {
  children: ReactNode;
  refetchBehandling: BehandlingContextType['refetchBehandling'];
}) => {
  return <BehandlingContext.Provider value={{ refetchBehandling }}>{children}</BehandlingContext.Provider>;
};
