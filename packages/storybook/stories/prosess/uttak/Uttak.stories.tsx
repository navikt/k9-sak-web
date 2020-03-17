import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak/src/UttakProsessIndex';
import BehandlingPersonMap from '@fpsak-frontend/prosess-uttak/src/components/types/BehandlingPersonMap';
import { uttaksplaner } from '@fpsak-frontend/prosess-uttak/src/components/types/testdata';

export default {
  title: 'prosess/prosess-pleiepenger-uttak',
  component: UttakProsessIndex,
  decorators: [withKnobs],
};

const behandlingPersonMap: BehandlingPersonMap = {
  123: {
    kjønn: 'K',
    navn: {
      fornavn: 'Anne',
      etternavn: 'Annesen',
    },
  },
  321: {
    kjønn: 'M',
    navn: {
      fornavn: 'Geir',
      etternavn: 'Geirsen',
    },
  },
  456: {
    kjønn: 'K',
    navn: {
      fornavn: 'Marie',
      etternavn: 'Mariesen',
    },
  },
  789: {
    kjønn: 'M',
    navn: {
      fornavn: 'Arne',
      etternavn: 'Arnesen',
    },
  },
};

export const uttak = () => <UttakProsessIndex uttaksplaner={uttaksplaner} behandlingPersonMap={behandlingPersonMap} />;
