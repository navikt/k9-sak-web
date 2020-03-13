import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-sak-web/types/src/behandlingTsType';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import messages from '../i18n/nb_NO.json';
import UttakFaktaPanel from './components/UttakFaktaPanel';
import Arbeid from './components/types/Arbeid';

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
  arbeid: Arbeid[];
  submitCallback: (values: Arbeid[]) => void;
  personopplysninger: Personopplysninger;
}

const UttakFaktaIndex: FunctionComponent<UttakFaktaIndexProps> = ({
  behandling,
  arbeid,
  submitCallback,
  personopplysninger,
}) => (
  <RawIntlProvider value={intl}>
    <UttakFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeid={arbeid}
      submitCallback={submitCallback}
      personopplysninger={personopplysninger}
    />
  </RawIntlProvider>
);

export default UttakFaktaIndex;
