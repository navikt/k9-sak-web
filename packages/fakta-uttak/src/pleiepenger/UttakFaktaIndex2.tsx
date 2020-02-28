import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
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
  submitCallback: (values: Arbeidsgiver[]) => void;
}

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({ behandling, arbeidsgivere, submitCallback }) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaForm2
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeidsgivere={arbeidsgivere}
      submitCallback={submitCallback}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
