import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import {
  Aksjonspunkt,
  ArbeidsforholdV2,
  Behandling,
  UtfallEnum,
  Uttaksperiode,
  Vilkår,
  VilkårEnum,
  VurderteVilkår,
} from '@k9-sak-web/types';
import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import Aktivitet from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Aktivitet';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
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
  fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
  vurderteVilkår: {
    vilkår: {
      ...vilkårInnvilget,
      [vilkår]: UtfallEnum.UAVKLART,
    },
  },
  periode: '2020-05-01/2020-05-10',
  utbetalingsgrad: 50,
  hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
});

const innvilgetPeriode: Uttaksperiode = {
  utfall: UtfallEnum.INNVILGET,
  fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
  vurderteVilkår: {
    vilkår: vilkårInnvilget,
  },
  delvisFravær: 'P2DT4H30M',
  periode: '2020-04-01/2020-04-19',
  utbetalingsgrad: 100,
  hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
};

const nullFravær: Uttaksperiode = {
  utfall: UtfallEnum.INNVILGET,
  fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
  vurderteVilkår: {
    vilkår: vilkårInnvilget,
  },
  delvisFravær: 'PT0H',
  periode: '2020-04-19/2020-04-19',
  utbetalingsgrad: 100,
  hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
};

const avslåttPeriode: Uttaksperiode = {
  utfall: UtfallEnum.AVSLÅTT,
  fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
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

const orgNr1 = '456';

const arbForhId1 = '123456789';
const arbForhId2 = '987654321';

const aktivitet: Aktivitet = {
  arbeidsforhold: {
    arbeidsforholdId: arbForhId1,
    organisasjonsnummer: orgNr1,
    type: 'SN',
  },
  uttaksperioder: [innvilgetPeriode],
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
          arbeidsforholdId: arbForhId2,
          organisasjonsnummer: orgNr1,
          type: 'AT',
        },
        uttaksperioder: perioder,
      },
      aktivitet,
    ],
    aktiv: true,
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
  rammevedtak: [],
  barna: [],
});

const behandling = {
  id: 1,
  versjon: 1,
} as Behandling;

const aksjonspunkterForSteg = [{ status: '', definisjon: '9003' }] as Aksjonspunkt[];

const arbeidsforhold = [
  {
    id: arbForhId1,
    arbeidsgiver: {
      arbeidsgiverOrgnr: '12345678',
    },
    arbeidsforhold: {
      eksternArbeidsforholdId: arbForhId1,
    },
  },
  {
    id: arbForhId2,
    arbeidsgiver: {
      arbeidsgiverOrgnr: '12345678',
    },
    arbeidsforhold: {
      eksternArbeidsforholdId: arbForhId2,
    },
  },
] as ArbeidsforholdV2[];

const arbeidsgivere = {
  12345678: {
    erPrivatPerson: false,
    referanse: '12345678',
    identifikator: orgNr1,
    navn: 'Bedrift AS',
    arbeidsforholdreferanser: [
      { internArbeidsforholdId: arbForhId1, eksternArbeidsforholdId: arbForhId1 },
      { internArbeidsforholdId: arbForhId2, eksternArbeidsforholdId: arbForhId2 },
    ],
  },
};

export const aksjonspunktUidentifiserteRammevedtak = () => (
  <ÅrskvantumIndex
    årskvantum={{
      ...årskvantumMedPerioder([innvilgetPeriode, uavklartPeriode(VilkårEnum.UIDENTIFISERT_RAMMEVEDTAK)]),
      rammevedtak: [uidentifisertRammevedtak],
    }}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);

export const behandletAksjonspunkt = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([innvilgetPeriode, innvilgetPeriode, nullFravær])}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen={false}
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={[{ begrunnelse: 'fordi' }] as Aksjonspunkt[]}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);

export const aksjonspunktAvslåttePerioder = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([avslåttPeriode, avslåttPeriode])}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);

export const aksjonspunktFosterbarnUten = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([avslåttPeriode, avslåttPeriode])}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    fosterbarn={[]}
  />
);

export const aksjonspunktFosterbarnMed = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([avslåttPeriode, avslåttPeriode])}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    fosterbarn={[
      { fnr: '12345678910', navn: 'Dole Duck', fødselsdato: '12.34.5678' },
      { fnr: '10987654321', navn: 'Doffen Duck', fødselsdato: '10.98.7654' },
    ]}
  />
);

export const aksjonspunktOverlappendePerioderIInfotrygd = () => (
  <ÅrskvantumIndex
    årskvantum={årskvantumMedPerioder([uavklartPeriode(VilkårEnum.NOK_DAGER), avslåttPeriode])}
    alleKodeverk={alleKodeverk as any}
    behandling={behandling}
    isAksjonspunktOpen
    submitCallback={action('bekreft')}
    aksjonspunkterForSteg={aksjonspunkterForSteg}
    arbeidsforhold={arbeidsforhold}
    fullUttaksplan={{ aktiviteter: [] }}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);
