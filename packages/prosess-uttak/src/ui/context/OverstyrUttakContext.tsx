import React, { createContext } from 'react';

import { httpUtils } from '@fpsak-frontend/utils';

import dayjs from 'dayjs';
import ContainerContext from './ContainerContext';
import { Arbeidsforhold, OverstyrbareAktiviteterResponse, OverstyringUttak, OverstyrtUttakResponse } from '../../types';

type OverstyrUttakContextType = {
  lasterOverstyringer: boolean;
  lasterAktiviteter: boolean;
  overstyrte: null | OverstyringUttak[];
  arbeidsgivere: null | OverstyrtUttakResponse['arbeidsgiverOversikt']['arbeidsgivere'];
  hentAktuelleAktiviteter: (fom: Date, tom: Date) => Promise<Arbeidsforhold[]>;
  hentOverstyrte: () => void;
};

const OverstyrUttakContext = createContext<OverstyrUttakContextType | null>(null);

export const OverstyrUttakContextProvider = ({ children }) => {
  const { httpErrorHandler, endpoints, aktivBehandlingUuid, versjon } = React.useContext(ContainerContext);
  const [lasterOverstyringer, setLasterOverstyringer] = React.useState<boolean>(false);
  const [lasterAktiviteter, setLasterAktiviteter] = React.useState<boolean | null>(null);
  const [overstyrte, setOverstyrte] = React.useState<OverstyringUttak[] | null>(null);
  const [arbeidsgivere, setArbeidsgivere] = React.useState<
    OverstyrtUttakResponse['arbeidsgiverOversikt']['arbeidsgivere'] | null
  >(null);

  const hentOverstyrte = async () => {
    setLasterOverstyringer(true);
    const apiResult: OverstyrtUttakResponse = await httpUtils
      .get(endpoints.behandlingUttakOverstyrt, httpErrorHandler)
      .then((response: OverstyrtUttakResponse) => response);
    setOverstyrte(apiResult?.overstyringer || []);
    setArbeidsgivere(apiResult?.arbeidsgiverOversikt?.arbeidsgivere || {});
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

    setLasterAktiviteter(false);
    return apiResult.arbeidsforholdsperioder;
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
      arbeidsgivere,
      hentOverstyrte,
    }),
    [lasterOverstyringer, lasterAktiviteter, hentAktuelleAktiviteter, overstyrte, arbeidsgivere, hentOverstyrte],
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
