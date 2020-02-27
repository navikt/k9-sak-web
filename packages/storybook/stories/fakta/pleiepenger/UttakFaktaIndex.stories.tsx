import React from 'react';
import UttakFaktaIndex, { Arbeidsgiver } from '@fpsak-frontend/fakta-uttak/src/pleiepenger/UttakFaktaIndex2';
import { withKnobs } from '@storybook/addon-knobs';
import Behandling from '@k9-frontend/types/src/behandlingTsType';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-uttak',
  component: UttakFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  status: {
    kode: '1',
    kodeverk: '1',
    navn: 'dmj',
  },
  type: {
    kode: '1',
    kodeverk: '1',
    navn: 'dmj',
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  links: [],
};

const arbeidsgivere: Arbeidsgiver[] = [
  // {
  //   arbeidsforhold: [
  //     {
  //       stillingsnavn: 'Vaskehjelp',
  //       perioder: [
  //         {
  //           fom: '2020-02-02',
  //           tom: '2020-03-02',
  //           timerIJobbTilVanlig: 37.5,
  //           timerFårJobbet: 40,
  //         },
  //       ],
  //     },
  //   ],
  //   navn: 'Norsk Hydro',
  //   organisasjonsnummer: '90545120125',
  // },
  {
    arbeidsforhold: [
      {
        stillingsnavn: 'Oljeborer',
        perioder: [
          {
            fom: '2020-02-02',
            tom: '2020-03-02',
            timerIJobbTilVanlig: 40,
            timerFårJobbet: 20,
          },
          {
            fom: '2020-04-02',
            tom: '2020-05-02',
            timerIJobbTilVanlig: 40,
            timerFårJobbet: 20,
          },
        ],
      },
    ],
    navn: 'Equinor',
    organisasjonsnummer: '90545120125',
  },
];

export const avklarArbeidsforhold = () => <UttakFaktaIndex behandling={behandling} arbeidsgivere={arbeidsgivere} />;
