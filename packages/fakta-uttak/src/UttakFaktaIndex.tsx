import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import messages from '../i18n/nb_NO.json';
import UttakFaktaPanel from './components/UttakFaktaPanel';
import Arbeidsgiver from './components/types/Arbeidsgiver';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakFaktaIndexProps {
  behandling: Behandling;
  arbeidsgivere: Arbeidsgiver[];
  submitCallback: (values: Arbeidsgiver[]) => void;
  personopplysninger: Personopplysninger;
}

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({
  behandling,
  arbeidsgivere,
  submitCallback,
  personopplysninger,
}) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeidsgivere={arbeidsgivere}
      submitCallback={submitCallback}
      personopplysninger={personopplysninger}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
