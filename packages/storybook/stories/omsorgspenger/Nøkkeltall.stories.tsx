import React from 'react';
import NøkkeltallIndex from '@k9-sak-web/fakta-nokkeltall-oms';
import UttaksplanType from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/UttaksplanType';

export default {
  title: 'omsorgspenger/fakta/Nøkkeltall',
  component: NøkkeltallIndex,
};

const sisteUttaksplan: UttaksplanType = {
  aktiv: true,
  aktiviteter: [],
  benyttetRammemelding: true,
  saksnummer: '',
  behandlingUUID: '',
  innsendingstidspunkt: '',
};

export const nøkkeltall = () => (
  <NøkkeltallIndex
    totaltAntallDager={10}
    antallDagerArbeidsgiverDekker={3}
    antallKoronadager={10}
    forbruktTid="PT13H30M"
    antallDagerInfotrygd={4.7}
    restTid="PT79H"
    sisteUttaksplan={sisteUttaksplan}
    rammevedtak={[]}
    barna={[]}
  />
);
