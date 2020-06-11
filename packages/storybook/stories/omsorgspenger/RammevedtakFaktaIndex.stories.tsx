import * as React from 'react';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/fakta/Dager til utbetaling',
  component: FaktaRammevedtakIndex,
  decorators: [withReduxProvider],
};

// @ts-ignore
const behandling: Behandling = {
  id: 1,
  versjon: 1,
};

const fnrEtBarn = '12121212121';

const utvidetRettManglendeFnr: Rammevedtak = {
  type: RammevedtakEnum.UTVIDET_RETT,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2028-12-31',
  fritekst: '@9-6 2 L UTV.OMSD*20/',
};

const utvidetRett: Rammevedtak = {
  ...utvidetRettManglendeFnr,
  utvidetRettFor: fnrEtBarn,
};

const aleneOmOmsorgen: Rammevedtak = {
  type: RammevedtakEnum.ALENEOMSORG,
  aleneOmOmsorgenFor: fnrEtBarn,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
};

const aleneOmOmsorgenManglendeFnr: Rammevedtak = {
  type: RammevedtakEnum.ALENEOMSORG,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
  fritekst: '@9-6 2 L AL.OMSD*10/',
};

const fosterbarn: Rammevedtak = {
  type: RammevedtakEnum.FOSTERBARN,
  mottaker: fnrEtBarn,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
};

const fosterbarnManglendeFnr: Rammevedtak = {
  type: RammevedtakEnum.FOSTERBARN,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
  fritekst: '@9-6 2 L FOST/',
};

const utenlandskBarn: Rammevedtak = {
  type: RammevedtakEnum.UTENLANDSK_BARN,
  fødselsdato: '030318',
  gyldigFraOgMed: '2019-02-20',
  gyldigTilOgMed: '2021-12-31',
};

const midlertidigAleneOmOmsorgen: Rammevedtak = {
  type: RammevedtakEnum.MIDLERTIDIG_ALENEOMSORG,
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
};

const uidentifisertRammevedtak: Rammevedtak = {
  type: RammevedtakEnum.UIDENTIFISERT,
  fritekst: '03070189827 @9-6,20 D (Denne mangler type)',
};

const overføringFårRammevedtak = (type: RammevedtakType, lengde): Rammevedtak => ({
  type,
  lengde,
  avsender: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

const overføringGirRammevedtak = (type: RammevedtakType, lengde): Rammevedtak => ({
  type,
  lengde,
  mottaker: '02028920544',
  gyldigFraOgMed: '2020-01-01',
  gyldigTilOgMed: '2020-12-31',
});

export const medBarnOgUidentifiserteRammevedtak = () => (
  <FaktaRammevedtakIndex
    rammevedtak={[
      uidentifisertRammevedtak,
      { ...uidentifisertRammevedtak, fritekst: '010119 (mangler alt)' },
      utvidetRettManglendeFnr,
      utvidetRett,
      {
        ...utvidetRett,
        gyldigTilOgMed: undefined,
        utvidetRettFor: '55555555555',
      },
      fosterbarn,
      fosterbarnManglendeFnr,
      utenlandskBarn,
      aleneOmOmsorgen,
      aleneOmOmsorgenManglendeFnr,
      { ...aleneOmOmsorgen, aleneOmOmsorgenFor: '78978978978' },
      overføringFårRammevedtak(RammevedtakEnum.OVERFØRING_FÅR, 'P4D'),
      overføringFårRammevedtak(RammevedtakEnum.OVERFØRING_FÅR, 'P7D'),
      overføringFårRammevedtak(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P4D'),
      overføringGirRammevedtak(RammevedtakEnum.OVERFØRING_GIR, 'P8D'),
      overføringGirRammevedtak(RammevedtakEnum.FORDELING_GIR, 'P1D'),
      overføringGirRammevedtak(RammevedtakEnum.KORONAOVERFØRING_GIR, 'P2D'),
      overføringGirRammevedtak(RammevedtakEnum.FORDELING_GIR, 'P4D'),
    ]}
    behandling={behandling}
  />
);

export const ingenBarn = () => (
  <FaktaRammevedtakIndex
    rammevedtak={[
      overføringFårRammevedtak(RammevedtakEnum.OVERFØRING_FÅR, 'P13D'),
      overføringFårRammevedtak(RammevedtakEnum.KORONAOVERFØRING_FÅR, 'P5D'),
      midlertidigAleneOmOmsorgen,
    ]}
    behandling={behandling}
  />
);
