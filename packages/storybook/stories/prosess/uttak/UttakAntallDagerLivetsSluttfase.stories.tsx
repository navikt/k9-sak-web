import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import AntallDagerLivetsSluttfaseIndex from '@k9-sak-web/prosess-uttak-antall-dager-sluttfase/src/AntallDagerLivetsSluttfaseIndex';

export default {
  title: 'prosess/antall-dager-livets-sluttfase',
  component: AntallDagerLivetsSluttfaseIndex,
  decorators: [withKnobs],
};

export const antallDagerLivetsSluttfaseIndex = () =>
  <AntallDagerLivetsSluttfaseIndex
    maxAntallDager={60}
    antallDagerInnvilgetForPleietrengendeHittil={20}
    antallDagerInnvilgetMedBehandlingen={10}
    sistePleiedag="2021.01.02"
  />;