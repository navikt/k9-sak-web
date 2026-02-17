import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

// Med tiden bør fetching av behandling gjøres av tanstack query
// Da bør vi kunne invalidere query etter behov for å trigge refetch av behandling
// og dermed kan setBehandling fjernes fra contexten.
export interface BehandlingContextType {
  // refetchBehandling kan vi fjerne når alle avhengigheter til den er fjernet.
  refetchBehandling: () => Promise<any>;
  /** Enktelte endepunkter setter i gang tasks i backend som tar tid å fullføre.
   * De inkluderer en location-header med URL man kan polle for å vite når behandlingen er klar igjen
   * Når behandlingen er klar returneres en BehandlingDto av polling-endepunktet som kan brukes, og det er ikke nødvendig å refetche manuelt */
  setBehandling?: (behandling: BehandlingDto) => void;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  refetchBehandling: () => Promise.resolve(null),
});

export const BehandlingProvider = ({
  children,
  refetchBehandling,
  setBehandling,
}: {
  children: ReactNode;
  // refe
  refetchBehandling: BehandlingContextType['refetchBehandling'];
  setBehandling?: BehandlingContextType['setBehandling'];
}) => {
  return (
    <BehandlingContext.Provider value={{ refetchBehandling, setBehandling }}>{children}</BehandlingContext.Provider>
  );
};
