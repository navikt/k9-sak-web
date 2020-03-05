import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import messages from '../../i18n/nb_NO.json';
import UttakFaktaPanel from './UttakFaktaPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

// TODO: interfaces inn i types/uttakfakta elns
export interface ArbeidsforholdPeriode {
  fom: string;
  tom: string;
  timerIJobbTilVanlig: number;
  timerFårJobbet: number;
}

export interface Arbeidsforhold {
  stillingsnavn?: string; // TODO: fjern - har ikke denne infoen
  arbeidsgiversArbeidsforholdId: string;
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
    <UttakFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeidsgivere={arbeidsgivere}
      submitCallback={submitCallback}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
