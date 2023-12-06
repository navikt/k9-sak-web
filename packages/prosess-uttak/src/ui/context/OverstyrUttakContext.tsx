import React, { createContext } from 'react';

import { get, post } from '@navikt/k9-fe-http-utils';

import dayjs from 'dayjs';
import ContainerContext from './ContainerContext';
import { Arbeidsforhold, OverstyrbareAktiviteterResponse, OverstyringUttak, OverstyrtUttakResponse } from '../../types';

const mockApiCall = (fom: Date, tom: Date): Promise<{ arbeidsforholdsperioder: any[] }> =>
  new Promise(resolve => {
    setTimeout(() => {
      const apiResult = {
        arbeidsforholdsperioder: [
          {
            arbeidsforhold: {
              type: 'BLAH type',
              organisasjonsnummer: '123123123',
              aktørId: 'aktørid',
              arbeidsforholdId: 'arbedsfholdid',
            },
          },
          {
            arbeidsforhold: {
              type: 'MEH',
              organisasjonsnummer: '123123123',
              aktørId: 'aktørid',
              arbeidsforholdId: 'arbedsfholdid',
            },
          },
        ],
      };
      resolve(apiResult);
    }, 1000);
  });

const mockApiCall2 = (): Promise<{ overstyringer: any[] }> =>
  new Promise(resolve => {
    setTimeout(() => {
      const apiResult = {
        overstyringer: [
          {
            id: 96912836,
            begrunnelse: 'Grundig begrunnet',
            periode: {
              fom: new Date().toISOString(),
              tom: new Date().toISOString(),
            },
            søkersUttaksgrad: 100.0,
            utbetalingsgrader: [
              {
                arbeidsforhold: {
                  type: 'AT',
                  organisasjonsnummer: '910909088',
                  aktørId: null,
                  arbeidsforholdId: null,
                },
                utbetalingsgrad: 50.0,
              },
            ],
          },
        ],
      };
      resolve(apiResult);
    }, 2000);
  });

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
  const [lasterAktiviteter, setLasterAktiviteter] = React.useState<boolean>(false);
  const [overstyrte, setOverstyrte] = React.useState<OverstyringUttak[] | null>(null);
  const [arbeidsgivere, setArbeidsgivere] = React.useState<
    OverstyrtUttakResponse['arbeidsgiverOversikt']['arbeidsgivere'] | null
  >(null);

  const hentOverstyrte = async () => {
    setLasterOverstyringer(true);
    const apiResult: OverstyrtUttakResponse = await get(endpoints.behandlingUttakOverstyrt, httpErrorHandler).then(
      (response: OverstyrtUttakResponse) => response,
    );

    setOverstyrte(apiResult?.overstyringer || []);
    setArbeidsgivere(apiResult?.arbeidsgiverOversikt?.arbeidsgivere || {});
    setLasterOverstyringer(false);
  };

  const hentAktuelleAktiviteter = async (fom: Date, tom: Date): Promise<Arbeidsforhold[]> => {
    setLasterAktiviteter(true);
    const apiResult = await post(
      endpoints.behandlingUttakOverstyrbareAktiviteter,
      {
        behandlingIdDto: aktivBehandlingUuid,
        fom: dayjs(fom).format('YYYY-MM-DD'),
        tom: dayjs(tom).format('YYYY-MM-DD'),
      },
      httpErrorHandler,
    ).then((response: OverstyrbareAktiviteterResponse) => response);

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
