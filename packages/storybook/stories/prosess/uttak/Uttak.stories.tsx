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
    kjønnkode: 'K',
    fnr: '12121250458',
  },
  321: {
    kjønnkode: 'M',
    fnr: '21035489154',
  },
  456: {
    kjønnkode: 'K',
    fnr: '30108965157',
  },
  789: {
    kjønnkode: 'M',
    fnr: '04040454120',
  },
};

export const uttak = () => <UttakProsessIndex uttaksplaner={uttaksplaner} behandlingPersonMap={behandlingPersonMap} />;
