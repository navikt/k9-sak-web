import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import { createContext, useContext, type ReactElement, type ReactNode } from 'react';

// Kun det som sendes inn fra skallet og brukes av mange komponenter. Alt som kan utledes eller hentes ligger utenfor.
export type UttakContextType = {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrer: boolean;
  readOnly: boolean;
  onAksjonspunktBekreftet?: () => void;
};

export interface UttakProviderProps {
  value: UttakContextType;
  children: ReactNode;
}

export const UttakContext = createContext<UttakContextType | undefined>(undefined);

export const UttakProvider = ({ value, children }: UttakProviderProps): ReactElement => (
  <UttakContext.Provider value={value}>{children}</UttakContext.Provider>
);

export const useUttakContext = () => {
  const uttakContext = useContext(UttakContext);
  if (uttakContext === undefined) {
    throw new Error('useUttakContext must be used within a UttakProvider');
  }
  return uttakContext;
};
