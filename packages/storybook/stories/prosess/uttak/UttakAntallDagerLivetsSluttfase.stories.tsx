import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import AntallDagerLivetsSluttfaseIndex from '@k9-sak-web/prosess-uttak-antall-dager-sluttfase/src/AntallDagerLivetsSluttfaseIndex';
import KvoteInfo from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/types/KvoteInfo';

export default {
  title: 'prosess/antall-dager-livets-sluttfase',
  component: AntallDagerLivetsSluttfaseIndex,
  decorators: [withKnobs],
};

const kvoteInfo: KvoteInfo = {
  maxDato: '2021-02-20',
  forbruktKvoteHittil: 2,
  forbruktKvoteDenneBehandlingen: 3
};

export const antallDagerLivetsSluttfaseIndex = () =>
  <AntallDagerLivetsSluttfaseIndex
    kvoteInfo={kvoteInfo}
  />;