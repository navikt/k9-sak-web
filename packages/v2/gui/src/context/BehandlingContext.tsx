import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { BekreftAksjonspunktClient } from '../shared/hooks/useBekreftAksjonspunkt.js';

// Med tiden bør fetching av behandling gjøres av tanstack query
// Da bør vi kunne invalidere query etter behov for å trigge refetch av behandling
// og dermed kan setBehandling fjernes fra contexten.
export interface BehandlingContextType {
  /** Behandlingen konteksten gjelder for */
  behandling?: Pick<BehandlingDto, 'id' | 'versjon' | 'uuid'>;
  // refetchBehandling kan vi fjerne når alle avhengigheter til den er fjernet.
  refetchBehandling: () => Promise<any>;
  /** Enktelte endepunkter setter i gang tasks i backend som tar tid å fullføre.
   * De inkluderer en location-header med URL man kan polle for å vite når behandlingen er klar igjen
   * Når behandlingen er klar returneres en BehandlingDto av polling-endepunktet som kan brukes, og det er ikke nødvendig å refetche manuelt */
  setBehandling?: (behandling: BehandlingDto) => void;
  /** Klient for å bekrefte aksjonspunkter mot riktig backend. Typen er `any` internt — typesikkerhet ivaretas av `useBekreftAksjonspunkt<T>()`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aksjonspunktClient?: BekreftAksjonspunktClient<any>;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  refetchBehandling: () => Promise.resolve(null),
});

export const BehandlingProvider = ({
  children,
  behandling,
  refetchBehandling,
  setBehandling,
  aksjonspunktClient,
}: {
  children: ReactNode;
  behandling?: BehandlingContextType['behandling'];
  refetchBehandling: BehandlingContextType['refetchBehandling'];
  setBehandling?: BehandlingContextType['setBehandling'];
  aksjonspunktClient?: BehandlingContextType['aksjonspunktClient'];
}) => {
  return (
    <BehandlingContext.Provider value={{ behandling, refetchBehandling, setBehandling, aksjonspunktClient }}>
      {children}
    </BehandlingContext.Provider>
  );
};
