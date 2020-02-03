import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import UttakPP from '@fpsak-frontend/prosess-uttak/src/pleiepenger/UttakkPP';

export default {
  title: 'prosess/prosess-pleiepenger-uttak',
  component: UttakPP,
  decorators: [withKnobs],
};

const behandlinger = {
  123: {
    perioder: {
      '2020-01-01/2020-01-14': {
        grad: 50.0,
      },
      '2020-02-01/2020-02-14': {
        grad: 100,
      },
    },
  },
  456: {
    perioder: {
      '2020-01-15/2020-01-29': {
        grad: 50.0,
      },
      '2020-02-15/2020-02-29': {
        grad: 73.5,
      },
    },
  },
};

const behandlingPersonMap = {
  123: {
    kjønnkode: 'K',
  },
  456: {
    kjønnkode: 'M',
  },
};

export const uttak = () => <UttakPP behandlinger={behandlinger} behandlingPersonMap={behandlingPersonMap} />;
