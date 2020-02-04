import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak/src/pleiepenger/UttakProsessIndex';
import { ResultattypeEnum } from '@fpsak-frontend/prosess-uttak/src/pleiepenger/types/Resultattype';

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
        resultat_type: ResultattypeEnum.INNVILGET,
      },
      '2020-01-22/2020-01-28': {
        grad: 40,
        resultat_type: ResultattypeEnum.AVSLÅTT,
      },
    },
  },
  321: {
    perioder: {
      '2020-01-22/2020-01-28': {
        grad: 40,
        resultat_type: ResultattypeEnum.AVSLÅTT,
      },
      '2020-01-08/2020-01-14': {
        grad: 50,
        resultat_type: ResultattypeEnum.INNVILGET,
      },
    },
  },
  456: {
    perioder: {
      '2020-01-01/2020-01-07': {
        grad: 50.0,
        resultat_type: ResultattypeEnum.INNVILGET,
      },
      '2020-01-15/2020-01-21': {
        grad: 100,
        resultat_type: ResultattypeEnum.UAVKLART,
      },
      '2020-01-29/2020-02-04': {
        grad: 100,
        resultat_type: ResultattypeEnum.INNVILGET,
      },
    },
  },
  789: {
    perioder: {
      '2020-01-08/2020-01-14': {
        grad: 50,
        resultat_type: ResultattypeEnum.INNVILGET,
      },
      '2020-01-22/2020-01-28': {
        grad: 20,
        resultat_type: ResultattypeEnum.UAVKLART,
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
