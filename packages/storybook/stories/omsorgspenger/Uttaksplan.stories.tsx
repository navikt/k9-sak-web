import React from 'react';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import { ÅrsakEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Årsak';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import ÅrskvantumForbrukteDager from '../../../prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: ÅrskvantumIndex,
};

const årskvantumDto: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 10.4,
  restdager: 9.6,
  sisteUttaksplan: {
    aktiviteter: [
      {
        arbeidsforhold: {
          arbeidsforholdId: '123',
          organisasjonsnummer: '456',
          type: 'arbeidstaker',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.INNVILGET,
            årsak: ÅrsakEnum.INNVILGET_ORDINÆR,
            delvisFravær: 'P2DT4H30M',
            periode: '2020-04-01/2020-04-30',
            utbetalingsgrad: 100,
          },
          {
            utfall: UtfallEnum.INNVILGET,
            årsak: ÅrsakEnum.INNVILGET_ORDINÆR,
            periode: '2020-03-01/2020-03-31',
            utbetalingsgrad: 50,
          },
        ],
      },
      {
        arbeidsforhold: {
          arbeidsforholdId: '888',
          organisasjonsnummer: '999',
          type: 'selvstendig næringsdrivende',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.AVSLÅTT,
            årsak: ÅrsakEnum.AVSLÅTT_IKKE_FLERE_DAGER,
            periode: '2020-03-01/2020-03-31',
            utbetalingsgrad: 0,
          },
        ],
      },
    ],
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
  },
};

export const årskvantum = () => <ÅrskvantumIndex årskvantum={årskvantumDto} />;
