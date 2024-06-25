import React, { createContext, useMemo, useState } from 'react';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';

type BehandlingContextValuesType = {
  behandlingId: number | undefined;
  behandlingVersjon: number | undefined;
  behandlingType: BehandlingType | undefined;
};

type BehandlingContextFunctionsType = {
  setBehandlingContext?: ({
    behandlingId,
    behandlingVersjon,
    behandlingType,
  }: {
    behandlingId: number;
    behandlingVersjon: number;
    behandlingType: BehandlingType | undefined;
  }) => void;
};

type BehandlingContextType = BehandlingContextValuesType & BehandlingContextFunctionsType;

const initialValues: BehandlingContextValuesType = {
  behandlingId: undefined,
  behandlingVersjon: undefined,
  behandlingType: undefined,
};

export const BehandlingContext = createContext<BehandlingContextType>(initialValues);

/*
 * BehandlingsId og BehandlingsVersjon blir brukt overalt i løsningen, og alle k9-sak-web spesifikke
 * komponenter skal ha et forhold til disse verdiene. Tenker derfor at Context er en god løsning for dette.
 * Bør være obs på gjenbrukbare komponenter fra andre løsniger og løfte hentingen av verdiene til nærmeeste
 * k9-sak-web "wrapper" komponent.
 *
 * For å prøve å holde denne contexten relativt ryddig begrenses verdiene til id, versjon og type. Disse er
 * ganske statiske og universale gjennom løsningen.
 */
export const BehandlingProvider = ({ children }: { children: React.ReactNode }) => {
  const [behandlingContext, setBehandlingContext] = useState<BehandlingContextValuesType>(initialValues);

  const value = useMemo(
    () => ({
      behandlingId: behandlingContext.behandlingId,
      behandlingVersjon: behandlingContext.behandlingVersjon,
      behandlingType: behandlingContext.behandlingType,
      setBehandlingContext,
    }),
    [behandlingContext],
  );

  return <BehandlingContext.Provider value={value}>{children}</BehandlingContext.Provider>;
};
