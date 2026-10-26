import { useContext, createContext, type ReactNode } from 'react';

export interface BehandlingContextType {
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: () => Promise<any>;
  /**
   * Sann mens data for ny behandlingsversjon hentes og data for forrige versjon fortsatt vises.
   * Prosessteg skal ikke velges ut fra data i denne perioden.
   */
  erBehandlingsdataUtdatert?: boolean;
  /** Setter ny behandling rett etter lagring, før navigering. */
  settBehandling?: (behandling: { versjon: number }) => void;
}

export const BehandlingContext = createContext<BehandlingContextType | undefined>(undefined);

export const BehandlingProvider = ({
  children,
  behandlingUuid,
  behandlingVersjon,
  refetchBehandling,
  erBehandlingsdataUtdatert,
  settBehandling,
}: {
  children: ReactNode;
  behandlingUuid?: string;
  behandlingVersjon?: number;
  refetchBehandling: BehandlingContextType['refetchBehandling'];
  erBehandlingsdataUtdatert?: boolean;
  settBehandling?: BehandlingContextType['settBehandling'];
}) => {
  return (
    <BehandlingContext.Provider
      value={{ behandlingUuid, behandlingVersjon, refetchBehandling, erBehandlingsdataUtdatert, settBehandling }}
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
