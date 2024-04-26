import React, { createContext, useEffect, useMemo, useState } from 'react';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';

type KodeverkContextValuesType = {
  kodeverk: AlleKodeverk | undefined;
  klageKodeverk: AlleKodeverk | undefined;
  tilbakeKodeverk: AlleKodeverk | undefined;
};

type KodeverkContextFunctionsType = {
  setKodeverkContext?: ({
    kodeverk,
    klageKodeverk,
    tilbakeKodeverk,
  }: {
    kodeverk: AlleKodeverk;
    klageKodeverk: AlleKodeverk;
    tilbakeKodeverk: AlleKodeverk;
  }) => void;
};

type KodeverkContextType = KodeverkContextValuesType & KodeverkContextFunctionsType;

const initialValue: KodeverkContextValuesType = {
  kodeverk: undefined,
  klageKodeverk: undefined,
  tilbakeKodeverk: undefined,
};

export const KodeverkContext = createContext<KodeverkContextType>(initialValue);

export const KodeverkProvider = ({
  children,
}: {
  children: React.ReactNode;
  kodeverk?: AlleKodeverk;
  klageKodeverk?: AlleKodeverk;
  tilbakeKodeverk?: AlleKodeverk;
}) => {
  const [kodeverkContext, setKodeverkContext] = useState<KodeverkContextValuesType>(initialValue);

  const value = useMemo(
    () => ({
      kodeverk: kodeverkContext.kodeverk,
      klageKodeverk: kodeverkContext.klageKodeverk,
      tilbakeKodeverk: kodeverkContext.tilbakeKodeverk,
      setKodeverkContext,
    }),
    [kodeverkContext],
  );

  /*
   * Just for dev/test purposed Remove
   */
  useEffect(() => {
    console.log('UPDATE: kodeverk:', kodeverkContext.kodeverk);
  }, [kodeverkContext.kodeverk]);

  useEffect(() => {
    console.log('UPDATE: klageKodeverk:', kodeverkContext.klageKodeverk);
  }, [kodeverkContext.klageKodeverk]);

  useEffect(() => {
    console.log('UPDATE: tilbakeKodeverk:', kodeverkContext.tilbakeKodeverk);
  }, [kodeverkContext.tilbakeKodeverk]);

  return <KodeverkContext.Provider value={value}>{children}</KodeverkContext.Provider>;
};
