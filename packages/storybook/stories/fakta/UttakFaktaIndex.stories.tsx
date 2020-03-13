import React from 'react';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak/src/UttakFaktaIndex';
import { action } from '@storybook/addon-actions';
import { Behandling } from '@k9-sak-web/types';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import Arbeid from '@fpsak-frontend/fakta-uttak/src/components/types/Arbeid';
import withReduxProvider from '../../decorators/withRedux';

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

const arbeid: Arbeid[] = [
  {
    arbeidsforhold: {
      type: 'Arbeidstaker',
      organisasjonsnummer: '999999999',
      aktørId: null,
      arbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    perioder: {
      '2020-01-01/2020-01-31': {
        timerIJobbTilVanlig: 37.5,
        timerFårJobbet: 15,
        // jobberNormaltPerUke: 'PT7H30M',
        // skalJobbeProsent: '20',
      },
      '2020-02-01/2020-02-29': {
        timerIJobbTilVanlig: 15,
        timerFårJobbet: 7.5,
        // jobberNormaltPerUke: 'PT7H30M',
        // skalJobbeProsent: '20',
      },
    },
  },
  {
    arbeidsforhold: {
      type: 'Arbeidstaker',
      organisasjonsnummer: '111111111',
      aktørId: null,
      arbeidsforholdId: '3fa85f64-1234-4562-b3fc-2c963f66afa6',
    },
    perioder: {
      '2020-01-01/2020-03-31': {
        timerIJobbTilVanlig: 20,
        timerFårJobbet: 10,
        // jobberNormaltPerUke: 'PT7H30M',
        // skalJobbeProsent: '20',
      },
    },
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
    arbeid={arbeid}
    submitCallback={action('Bekreft og fortsett')}
    personopplysninger={personopplysninger}
  />
);
