import React from 'react';
import Årskvantum from '../../../prosess-aarskvantum-oms';
import ÅrskvantumForbrukteDager from '../../../prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

export default {
  title: 'omsorgspenger/prosess/Årskvantum',
  component: Årskvantum,
};

const årskvantumDto: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 10.4,
  restdager: 9.6,
  sisteUttaksplan: {
    aktiviteter: [],
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
  },
};

export const årskvantum = () => <Årskvantum årskvantum={årskvantumDto} />;
