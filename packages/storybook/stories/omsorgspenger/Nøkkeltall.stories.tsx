import React from 'react';
import NøkkeltallIndex from '@k9-sak-web/fakta-nokkeltall-oms';
import UttaksplanType from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/UttaksplanType';
import Aktivitet from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Aktivitet';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import { VilkårEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Vilkår';
import StoryRouter from 'storybook-react-router';

export default {
  title: 'omsorgspenger/fakta/Nøkkeltall',
  component: NøkkeltallIndex,
  decorators: [StoryRouter()],
};

const aktivitet = (periode: string): Aktivitet => ({
  arbeidsforhold: {
    arbeidsforholdId: '888',
    organisasjonsnummer: '999',
    type: 'SN',
  },
  uttaksperioder: [
    {
      utfall: UtfallEnum.INNVILGET,
      vurderteVilkår: {
        vilkår: {
          [VilkårEnum.ARBEIDSFORHOLD]: UtfallEnum.INNVILGET,
          [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
          [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
        },
      },
      delvisFravær: 'P2DT4H30M',
      periode,
      utbetalingsgrad: 100,
      hjemler: ['FTRL_9_5__1', 'FTRL_9_5__3', 'FTRL_9_3__1', 'FTRL_9_6__1'],
    },
  ],
});

const aktivitetISmittevernsperioden = aktivitet('2020-05-01/2020-05-19');
const aktivitetUtenomSmittevernsperioden = aktivitet('2020-02-01/2020-02-19');

const sisteUttaksplan: UttaksplanType = {
  aktiv: true,
  aktiviteter: [],
  benyttetRammemelding: true,
  saksnummer: '',
  behandlingUUID: '',
  innsendingstidspunkt: '',
};

export const koronatall = () => (
  <NøkkeltallIndex
    totaltAntallDager={10}
    antallDagerArbeidsgiverDekker={3}
    antallKoronadager={10}
    forbruktTid="PT75H"
    antallDagerInfotrygd={0}
    restTid="PT52H30M"
    sisteUttaksplan={sisteUttaksplan}
    rammevedtak={[]}
    barna={[]}
  />
);

export const standardtall = () => (
  <NøkkeltallIndex
    totaltAntallDager={15}
    antallDagerArbeidsgiverDekker={10}
    antallKoronadager={0}
    forbruktTid="PT22H30M"
    antallDagerInfotrygd={0}
    restTid="PT22H30M"
    sisteUttaksplan={{ ...sisteUttaksplan, benyttetRammemelding: false }}
    rammevedtak={[]}
    barna={[]}
  />
);

export const smittevernsdager = () => (
  <NøkkeltallIndex
    totaltAntallDager={10}
    antallDagerArbeidsgiverDekker={3}
    antallKoronadager={10}
    forbruktTid="PT138H"
    antallDagerInfotrygd={0}
    restTid="PT-10H-30M"
    smitteverndager="PT10H30M"
    sisteUttaksplan={{ ...sisteUttaksplan, aktiviteter: [aktivitetISmittevernsperioden] }}
    rammevedtak={[]}
    barna={[]}
  />
);

export const utbetaltForMangeDager = () => (
  <NøkkeltallIndex
    totaltAntallDager={10}
    antallDagerArbeidsgiverDekker={3}
    antallKoronadager={10}
    forbruktTid="PT138H"
    antallDagerInfotrygd={0}
    restTid="PT-10H-30M"
    sisteUttaksplan={{ ...sisteUttaksplan, aktiviteter: [aktivitetUtenomSmittevernsperioden] }}
    rammevedtak={[]}
    barna={[]}
  />
);
