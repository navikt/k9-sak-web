import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@fpsak-frontend/behandling-felles/src/types/behandlingTsType';
import messages from '../../i18n/nb_NO.json';
import UttakFaktaForm2 from './UttakFaktaForm2';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export interface ArbeidsforholdPeriode {
  fom: string;
  tom: string;
  timerIJobbTilVanlig: number;
  timerFårJobbet: number;
}

export interface Arbeidsforhold {
  stillingsnavn: string;
  perioder: ArbeidsforholdPeriode[];
}

export interface Arbeidsgiver {
  organisasjonsnummer: string;
  navn: string;
  arbeidsforhold: Arbeidsforhold[];
}

interface UttakFaktaIndexProps {
  behandling: Behandling;
  arbeidsgivere: Arbeidsgiver[];
}

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({ behandling, arbeidsgivere }) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaForm2
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      id="njkn"
      arbeidsgivere={arbeidsgivere}
      submitCallback={values => {
        console.log(JSON.stringify(values));
        return values;
      }}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
