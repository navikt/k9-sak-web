import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { PollingClient } from '@k9-sak-web/backend/shared/polling/createPollingClient.js';

// Med tiden bør fetching av behandling gjøres av tanstack query
// Da bør vi kunne invalidere query etter behov for å trigge refetch av behandling
// og dermed kan setBehandling fjernes fra contexten.
export interface BehandlingContextType {
  /** Behandlingen konteksten gjelder for */
  behandling?: Pick<BehandlingDto, 'id' | 'versjon'>;
  // refetchBehandling kan vi fjerne når alle avhengigheter til den er fjernet.
  refetchBehandling: () => Promise<any>;
  /** Enktelte endepunkter setter i gang tasks i backend som tar tid å fullføre.
   * De inkluderer en location-header med URL man kan polle for å vite når behandlingen er klar igjen
   * Når behandlingen er klar returneres en BehandlingDto av polling-endepunktet som kan brukes, og det er ikke nødvendig å refetche manuelt */
  setBehandling?: (behandling: BehandlingDto) => void;
  /** Klient for polling-kall som bruker riktig backend-klient med interceptorer (auth, headers). */
  pollingClient?: PollingClient;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  refetchBehandling: () => Promise.resolve(null),
});

export const BehandlingProvider = ({
  children,
  behandling,
  refetchBehandling,
  setBehandling,
  pollingClient,
}: {
  children: ReactNode;
  behandling?: BehandlingContextType['behandling'];
  refetchBehandling: BehandlingContextType['refetchBehandling'];
  setBehandling?: BehandlingContextType['setBehandling'];
  pollingClient?: BehandlingContextType['pollingClient'];
}) => {
  return (
    <BehandlingContext.Provider value={{ behandling, refetchBehandling, setBehandling, pollingClient }}>
      {children}
    </BehandlingContext.Provider>
  );
};
