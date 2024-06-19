import React, { createContext, useEffect, useMemo, useState } from 'react';
import { type AlleKodeverk } from '@k9-sak-web/lib/types/index.js';

type KodeverkContextValuesType = {
  behandlingType: string | undefined;
  kodeverk: AlleKodeverk | undefined;
  klageKodeverk: AlleKodeverk | undefined;
  tilbakeKodeverk: AlleKodeverk | undefined;
};

type KodeverkContextFunctionsType = {
  setKodeverkContext?: ({
    behandlingType,
    kodeverk,
    klageKodeverk,
    tilbakeKodeverk,
  }: {
    behandlingType: string;
    kodeverk: AlleKodeverk;
    klageKodeverk: AlleKodeverk;
    tilbakeKodeverk: AlleKodeverk;
  }) => void;
};

type KodeverkContextType = KodeverkContextValuesType & KodeverkContextFunctionsType;

const initialValue: KodeverkContextValuesType = {
  behandlingType: undefined,
  kodeverk: undefined,
  klageKodeverk: undefined,
  tilbakeKodeverk: undefined,
};

const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;

export const KodeverkContext = createContext<KodeverkContextType>(initialValue);

export const KodeverkProvider = ({
  children,
  behandlingType = undefined,
  kodeverk = undefined,
  klageKodeverk = undefined,
  tilbakeKodeverk = undefined,
}: {
  children: React.ReactNode;
  behandlingType: string | undefined;
  kodeverk?: AlleKodeverk;
  klageKodeverk?: AlleKodeverk;
  tilbakeKodeverk?: AlleKodeverk;
}) => {
  const [kodeverkContext, setKodeverkContextState] = useState<KodeverkContextValuesType>(initialValue);

  /**
   *
   * Verifiser at verdiene er satt og ikke er like før oppdatering av state
   */
  const setKodeverkContext = ({
    behandlingType: newBehandlingType,
    kodeverk: newKodeverk,
    klageKodeverk: newKlageKodeverk,
    tilbakeKodeverk: newTilbakeKodeverk,
  }: KodeverkContextValuesType) => {
    if (
      behandlingType !== newBehandlingType ||
      (!isEmptyObject(newKodeverk) && kodeverk !== newKodeverk) ||
      (!isEmptyObject(newKlageKodeverk) && klageKodeverk !== newKlageKodeverk) ||
      (!isEmptyObject(newTilbakeKodeverk) && tilbakeKodeverk !== newTilbakeKodeverk)
    ) {
      setKodeverkContextState({
        behandlingType: newBehandlingType,
        kodeverk: newKodeverk,
        klageKodeverk: newKlageKodeverk,
        tilbakeKodeverk: newTilbakeKodeverk,
      });
    }
  };

  const value = useMemo(
    () => ({
      behandlingType,
      kodeverk: kodeverk || kodeverkContext.kodeverk,
      klageKodeverk: klageKodeverk || kodeverkContext.klageKodeverk,
      tilbakeKodeverk: tilbakeKodeverk || kodeverkContext.tilbakeKodeverk,
      setKodeverkContext,
    }),
    [kodeverkContext],
  );

  return <KodeverkContext.Provider value={value}>{children}</KodeverkContext.Provider>;
};
