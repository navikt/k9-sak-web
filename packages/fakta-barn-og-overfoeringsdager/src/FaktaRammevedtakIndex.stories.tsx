import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak, RammevedtakEnum, RammevedtakType } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import React from 'react';
import FaktaRammevedtakIndex from './FaktaRammevedtakIndex';

export default {
  title: 'omsorgspenger/fakta/Rammevedtak',
  component: FaktaRammevedtakIndex,
};

// @ts-ignore
const behandling: Behandling = {
  id: 1,
  versjon: 1,
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
      overføringFårRammevedtak(RammevedtakEnum.FORDELING_FÅR, 'P3D'),
    ]}
    behandling={behandling}
  />
);
