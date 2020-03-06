import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import messages from '../../i18n/nb_NO.json';
import UttakFaktaPanel from './UttakFaktaPanel';
import Arbeidsgiver from './types/Arbeidsgiver';

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
