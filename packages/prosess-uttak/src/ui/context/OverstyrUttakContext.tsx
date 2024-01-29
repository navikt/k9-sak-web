import React, { createContext } from 'react';
import dayjs from 'dayjs';

import { httpUtils } from '@fpsak-frontend/utils';
import { arbeidstypeTilVisning } from '@k9-sak-web/prosess-uttak/src/constants/Arbeidstype';

import ContainerContext from './ContainerContext';
import { Arbeidsforhold, OverstyrbareAktiviteterResponse, OverstyringUttak, OverstyrtUttakResponse } from '../../types';

type OverstyrUttakContextType = {
  lasterOverstyringer: boolean;
  lasterAktiviteter: boolean;
  overstyrte: null | OverstyringUttak[];
  arbeidsgiverOversikt: null | OverstyrtUttakResponse['arbeidsgiverOversikt']['arbeidsgivere'];
  hentAktuelleAktiviteter: (fom: Date, tom: Date) => Promise<Arbeidsforhold[]>;
  hentOverstyrte: () => void;
  utledAktivitetNavn: (arbeidsforhold: Arbeidsforhold) => string;
};

const OverstyrUttakContext = createContext<OverstyrUttakContextType | null>(null);

export const OverstyrUttakContextProvider = ({ children }) => {
  const { httpErrorHandler, endpoints, aktivBehandlingUuid, versjon } = React.useContext(ContainerContext);
  const [lasterOverstyringer, setLasterOverstyringer] = React.useState<boolean>(false);
  const [lasterAktiviteter, setLasterAktiviteter] = React.useState<boolean | null>(null);
  const [overstyrte, setOverstyrte] = React.useState<OverstyringUttak[] | null>(null);
  const [arbeidsgiverOversikt, setArbeidsgiverOversikt] = React.useState<
    OverstyrtUttakResponse['arbeidsgiverOversikt']['arbeidsgivere'] | null
  >(null);

  const hentOverstyrte = async () => {
    setLasterOverstyringer(true);
    const apiResult: OverstyrtUttakResponse = await httpUtils
      .get(endpoints.behandlingUttakOverstyrt, httpErrorHandler)
      .then((response: OverstyrtUttakResponse) => response);
    setOverstyrte(apiResult?.overstyringer || []);
    setArbeidsgiverOversikt(
      apiResult?.arbeidsgiverOversikt?.arbeidsgivere ? apiResult?.arbeidsgiverOversikt?.arbeidsgivere : null,
    );
    setLasterOverstyringer(false);
  };

  const hentAktuelleAktiviteter = async (fom: Date, tom: Date): Promise<Arbeidsforhold[]> => {
    setLasterAktiviteter(true);
    const apiResult = await httpUtils
      .post(
        endpoints.behandlingUttakOverstyrbareAktiviteter,
        {
          behandlingIdDto: aktivBehandlingUuid,
          fom: dayjs(fom).format('YYYY-MM-DD'),
          tom: dayjs(tom).format('YYYY-MM-DD'),
        },
        httpErrorHandler,
      )
      .then((response: OverstyrbareAktiviteterResponse) => response);

    setArbeidsgiverOversikt(apiResult?.arbeidsgiverOversikt?.arbeidsgivere || null);
    setLasterAktiviteter(false);
    return apiResult.arbeidsforholdsperioder;
  };

  const utledAktivitetNavn = (arbeidsforhold: Arbeidsforhold): string => {
    let identifikator = null;
    if (arbeidsforhold.arbeidsforholdId) identifikator = arbeidsforhold.arbeidsforholdId;
    if (arbeidsforhold.orgnr) identifikator = arbeidsforhold.orgnr;
    if (arbeidsforhold.organisasjonsnummer) identifikator = arbeidsforhold.organisasjonsnummer;
    if (arbeidsforhold.aktørId) identifikator = arbeidsforhold.aktørId;

    if (arbeidsgiverOversikt && arbeidsgiverOversikt[identifikator]) return arbeidsgiverOversikt[identifikator].navn;
    if (arbeidsforhold.type === 'SN') return arbeidstypeTilVisning.SN;
    if (arbeidsforhold.type === 'BA') return arbeidstypeTilVisning.BA;
    if (identifikator === null || identifikator === undefined) return `${arbeidsforhold.type}`;
    return `${arbeidsforhold.type} ${identifikator}`;
  };

  React.useEffect(() => {
    hentOverstyrte();
  }, [versjon]);

  const value = React.useMemo(
    () => ({
      lasterOverstyringer,
      lasterAktiviteter,
      hentAktuelleAktiviteter,
      overstyrte,
      arbeidsgiverOversikt,
      hentOverstyrte,
      utledAktivitetNavn,
    }),
    [
      lasterOverstyringer,
      lasterAktiviteter,
      hentAktuelleAktiviteter,
      overstyrte,
      arbeidsgiverOversikt,
      hentOverstyrte,
      utledAktivitetNavn,
    ],
  );

  return <OverstyrUttakContext.Provider value={value}>{children}</OverstyrUttakContext.Provider>;
};

export const useOverstyrUttak = () => {
  const context = React.useContext(OverstyrUttakContext);
  if (!context) {
    throw new Error('useOverstyrUttakContext må brukes innenfor en OverstyrUttakContextProvider');
  }
  return { ...context };
};
