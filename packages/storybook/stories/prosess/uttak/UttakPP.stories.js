import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak/src/pleiepenger/UttakProsessIndex';

export default {
  title: 'prosess/prosess-pleiepenger-uttak',
  component: UttakProsessIndex,
  decorators: [withKnobs],
};

const behandlinger = {
  123: {
    perioder: {
      '2020-01-01/2020-01-07': {
        grad: 50.0,
      },
      '2020-01-22/2020-01-28': {
        grad: 40,
      },
    },
  },
  321: {
    perioder: {
      '2020-01-22/2020-01-28': {
        grad: 40,
      },
      '2020-01-08/2020-01-14': {
        grad: 50,
      },
    },
  },
  456: {
    perioder: {
      '2020-01-01/2020-01-07': {
        grad: 50.0,
      },
      '2020-01-15/2020-01-21': {
        grad: 100,
      },
      '2020-01-29/2020-02-04': {
        grad: 100,
      },
    },
  },
  789: {
    perioder: {
      '2020-01-08/2020-01-14': {
        grad: 50,
      },
      '2020-01-22/2020-01-28': {
        grad: 20,
      },
    },
  },
};

const behandlingPersonMap = {
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

export const uttak = () => <UttakProsessIndex behandlinger={behandlinger} behandlingPersonMap={behandlingPersonMap} />;
