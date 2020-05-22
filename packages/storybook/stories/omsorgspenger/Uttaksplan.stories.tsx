import React from 'react';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import { VilkårEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Vilkår';
import { VurderteVilkår } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import ÅrskvantumForbrukteDager from '../../../prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: ÅrskvantumIndex,
};

const vilkårInnvilget: VurderteVilkår = {
  [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
  [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
};

const årskvantumDto: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallKoronadager: 0,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 7.4,
  restdager: 9.6,
  antallDagerInfotrygd: 2,
  sisteUttaksplan: {
    aktiviteter: [
      {
        arbeidsforhold: {
          arbeidsforholdId: '123',
          organisasjonsnummer: '456',
          type: 'AT',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.UAVKLART,
            vurderteVilkår: {
              vilkår: {
                ...vilkårInnvilget,
                [VilkårEnum.UIDENTIFISERT_RAMMEVEDTAK]: UtfallEnum.UAVKLART,
              },
            },
            periode: '2020-03-01/2020-03-10',
            utbetalingsgrad: 50,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
          },
          {
            utfall: UtfallEnum.INNVILGET,
            vurderteVilkår: {
              vilkår: vilkårInnvilget,
            },
            delvisFravær: 'P2DT4H30M',
            periode: '2020-04-01/2020-04-30',
            utbetalingsgrad: 100,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
          },
        ],
      },
      {
        arbeidsforhold: {
          arbeidsforholdId: '888',
          organisasjonsnummer: '999',
          type: 'SN',
        },
        uttaksperioder: [
          {
            utfall: UtfallEnum.AVSLÅTT,
            vurderteVilkår: {
              vilkår: {
                ...vilkårInnvilget,
                [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
              },
            },
            periode: '2020-03-01/2020-03-31',
            utbetalingsgrad: 0,
            hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1', 'COVID19_4_3', 'COVID19_4_1__2'],
          },
        ],
      },
    ],
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
};

// @ts-ignore
export const standard = () => <ÅrskvantumIndex årskvantum={årskvantumDto} alleKodeverk={alleKodeverk} />;

export const smittevernsdager = () => (
  <ÅrskvantumIndex
    årskvantum={{
      ...årskvantumDto,
      antallKoronadager: 10,
      forbruktTid: 'PT180H',
      restTid: 'PT-34H-30M',
    }}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
  />
);
