import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import Vilkår, { VilkårEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Vilkår';
import Uttaksperiode, { VurderteVilkår } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import ÅrskvantumForbrukteDager from '../../../prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import alleKodeverk from '../mocks/alleKodeverk.json';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: ÅrskvantumIndex,
  decorators: [withKnobs, withReduxProvider],
};

const vilkårInnvilget: VurderteVilkår = {
  [VilkårEnum.ARBEIDSFORHOLD]: UtfallEnum.INNVILGET,
  [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
  [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
};

const uavklartPeriode = (vilkår: Vilkår): Uttaksperiode => ({
  utfall: UtfallEnum.UAVKLART,
  vurderteVilkår: {
    vilkår: {
      ...vilkårInnvilget,
      [vilkår]: UtfallEnum.UAVKLART,
    },
  },
  periode: '2020-03-01/2020-03-10',
  utbetalingsgrad: 50,
  hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
});

const innvilgetPeriode: Uttaksperiode = {
  utfall: UtfallEnum.INNVILGET,
  vurderteVilkår: {
    vilkår: vilkårInnvilget,
  },
  delvisFravær: 'P2DT4H30M',
  periode: '2020-04-01/2020-04-30',
  utbetalingsgrad: 100,
  hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
};

const avslåttPeriode: Uttaksperiode = {
  utfall: UtfallEnum.AVSLÅTT,
  vurderteVilkår: {
    vilkår: {
      [VilkårEnum.ARBEIDSFORHOLD]: UtfallEnum.AVSLÅTT,
      [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
      [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
    },
  },
  periode: '2020-03-01/2020-03-31',
  utbetalingsgrad: 0,
  hjemler: [
    'FTRL_9_5__1',
    'FTRL_9_5__3',
    'FTRL_9_3__1',
    'FTRL_9_6__1',
    'COVID19_4_3',
    'COVID19_4_1__2',
    'FTRL_9_6__2_OG_4',
  ],
};

const uidentifisertRammevedtak: Rammevedtak = {
  type: RammevedtakEnum.UIDENTIFISERT,
  fritekst: 'utolkbart blabla',
};

const årskvantumMedPerioder = (perioder: Uttaksperiode[]): ÅrskvantumForbrukteDager => ({
  totaltAntallDager: 17,
  antallKoronadager: 0,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 7.4,
  restdager: 9.6,
  restTid: 'PT802H30M',
  antallDagerInfotrygd: 2,
  sisteUttaksplan: {
    aktiviteter: [
      {
        arbeidsforhold: {
          arbeidsforholdId: '123',
          organisasjonsnummer: '456',
          type: 'AT',
        },
        uttaksperioder: perioder,
      },
      {
        arbeidsforhold: {
          arbeidsforholdId: '888',
          organisasjonsnummer: '999',
          type: 'SN',
        },
        uttaksperioder: [innvilgetPeriode],
      },
    ],
    aktiv: true,
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
  rammevedtak: [],
});

const årskvantumDto: ÅrskvantumForbrukteDager = årskvantumMedPerioder([innvilgetPeriode, innvilgetPeriode]);

// @ts-ignore
const behandling: Behandling = {
  id: 1,
  versjon: 1,
};

// @ts-ignore
const aksjonspunkterForSteg: Aksjonspunkt[] = [{}];

export const standard = () => (
  // @ts-ignore
  <ÅrskvantumIndex årskvantum={årskvantumDto} alleKodeverk={alleKodeverk} behandling={behandling} />
);

export const smittevernsdagerOgInaktiv = () => (
  <ÅrskvantumIndex
    årskvantum={{
      ...årskvantumMedPerioder([innvilgetPeriode, uavklartPeriode(VilkårEnum.NOK_DAGER)]),
      antallKoronadager: 10,
      forbruktTid: 'PT180H',
      restTid: 'PT-34H-30M',
      sisteUttaksplan: {
        ...årskvantumDto.sisteUttaksplan,
        aktiv: false,
      },
    }}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen={false}
    submitCallback={action('bekreft')}
  />
);

export const aksjonspunktUidentifiserteRammevedtak = () => (
  <ÅrskvantumIndex
    årskvantum={{
      ...årskvantumMedPerioder([innvilgetPeriode, uavklartPeriode(VilkårEnum.UIDENTIFISERT_RAMMEVEDTAK)]),
      rammevedtak: [uidentifisertRammevedtak],
    }}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
  />
);

export const behandletAksjonspunkt = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([innvilgetPeriode, innvilgetPeriode])}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen={false}
    submitCallback={action('bekreft')}
    // @ts-ignore
    aksjonspunkterForSteg={[{ begrunnelse: 'fordi' }]}
  />
);

export const aksjonspunktAvslåttePerioder = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([avslåttPeriode, avslåttPeriode])}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
  />
);

export const aksjonspunktOverlappendePerioderIInfotrygd = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([uavklartPeriode(VilkårEnum.NOK_DAGER), avslåttPeriode])}
    // @ts-ignore
    alleKodeverk={alleKodeverk}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
  />
);
