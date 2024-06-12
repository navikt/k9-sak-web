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
  const [kodeverkContext, setKodeverkContext] = useState<KodeverkContextValuesType>(initialValue);

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
