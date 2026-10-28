import { useCallback, useContext, createContext, type ReactNode } from 'react';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';

export interface BehandlingContextType {
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: () => Promise<unknown>;
  /**
   * Sann mens data for ny behandlingsversjon hentes og data for forrige versjon fortsatt vises.
   * Prosessteg skal ikke velges ut fra data i denne perioden.
   */
  erBehandlingsdataUtdatert?: boolean;
  /**
   * Setter ny behandling i Index rett etter lagring, før navigering. Tar imot svaret fra lagringen direkte og
   * ignorerer svar som ikke er en behandling.
   */
  settBehandling: (svar: unknown) => void;
  /**
   * For komponenter som bekrefter aksjonspunkt selv via generert klient. Venter til ny behandling er klar, setter den
   * og navigerer til steget med åpent aksjonspunkt.
   */
  onAksjonspunktBekreftet: () => Promise<void>;
}

export const BehandlingContext = createContext<BehandlingContextType | undefined>(undefined);

const erBehandlingDto = (svar: unknown): svar is BehandlingDto =>
  typeof svar === 'object' &&
  svar !== null &&
  'uuid' in svar &&
  typeof svar.uuid === 'string' &&
  'versjon' in svar &&
  typeof svar.versjon === 'number';

export const BehandlingProvider = ({
  children,
  behandlingUuid,
  behandlingVersjon,
  refetchBehandling,
  erBehandlingsdataUtdatert,
  settBehandling,
  oppdaterProsessStegOgFaktaPanelIUrl,
}: {
  children: ReactNode;
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: BehandlingContextType['refetchBehandling'];
  erBehandlingsdataUtdatert?: boolean;
  settBehandling: (behandling: BehandlingDto) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
}) => {
  const settBehandlingFraSvar = useCallback(
    (svar: unknown) => {
      if (erBehandlingDto(svar)) {
        settBehandling(svar);
      }
    },
    [settBehandling],
  );
  // Ny behandling settes før kalleren av refetchBehandling går videre (f.eks. navigerer til punkt=default)
  const refetchOgSettBehandling = async () => {
    settBehandlingFraSvar(await refetchBehandling());
  };
  const onAksjonspunktBekreftet = async () => {
    await refetchOgSettBehandling();
    oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
  };
  return (
    <BehandlingContext.Provider
      value={{
        behandlingUuid,
        behandlingVersjon,
        refetchBehandling: refetchOgSettBehandling,
        erBehandlingsdataUtdatert,
        settBehandling: settBehandlingFraSvar,
        onAksjonspunktBekreftet,
      }}
    >
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
