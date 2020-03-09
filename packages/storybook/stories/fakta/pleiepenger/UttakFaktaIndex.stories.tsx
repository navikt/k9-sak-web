import React from 'react';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak/src/pleiepenger/UttakFaktaIndex2';
import { action } from '@storybook/addon-actions';
import { Behandling } from '@k9-sak-web/types';
import Arbeidsgiver from '@fpsak-frontend/fakta-uttak/src/pleiepenger/types/Arbeidsgiver';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-uttak',
  component: UttakFaktaIndex,
  decorators: [withReduxProvider],
};

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  status: {
    kode: '1',
    kodeverk: '1',
  },
  type: {
    kode: '1',
    kodeverk: '1',
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  links: [],
};

const arbeidsgivere: Arbeidsgiver[] = [
  {
    arbeidsforhold: [
      {
        perioder: [
          {
            fom: '2020-02-02',
            tom: '2020-03-02',
            timerIJobbTilVanlig: 37.5,
            timerFårJobbet: 20,
          },
        ],
        arbeidsgiversArbeidsforholdId: 'unik id 1',
      },
      {
        perioder: [
          {
            fom: '2020-02-02',
            tom: '2020-03-02',
            timerIJobbTilVanlig: 52.5,
            timerFårJobbet: 45,
          },
        ],
        arbeidsgiversArbeidsforholdId: 'unik id 2',
      },
    ],
    navn: 'Norsk Hydro',
    organisasjonsnummer: '982156156456',
  },
  {
    arbeidsforhold: [
      {
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
            timerIJobbTilVanlig: 15,
            timerFårJobbet: 7.5,
          },
        ],
        arbeidsgiversArbeidsforholdId: 'unik id 1',
      },
    ],
    navn: 'Equinor',
    organisasjonsnummer: '90545120125',
  },
];

const personopplysninger: Personopplysninger = {
  navn: 'Reidar Rogersen',
  navBrukerKjonn: {
    kode: 'K',
    kodeverk: 'BRUKER_KJOENN',
  },
};

export const avklarArbeidsforhold = () => (
  <UttakFaktaIndex
    behandling={behandling}
    arbeidsgivere={arbeidsgivere}
    submitCallback={action('Bekreft og fortsett')}
    personopplysninger={personopplysninger}
  />
);
