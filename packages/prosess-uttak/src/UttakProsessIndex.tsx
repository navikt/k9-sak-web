import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import Uttak from './components/Uttak';
import Behandlinger from './components/types/UttakTypes';
import BehandlingPersonMap from './components/types/BehandlingPersonMap';
import UttakPanel from './components/UttakPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakProsessIndexProps {
  behandlinger: Behandlinger;
  behandlingPersonMap: BehandlingPersonMap;
}

const UttakProsessIndex: FunctionComponent<UttakProsessIndexProps> = ({ behandlinger, behandlingPersonMap }) => {
  return (
    <RawIntlProvider value={intl}>
      <UttakPanel>
        <Uttak behandlinger={behandlinger} behandlingPersonMap={behandlingPersonMap} />
      </UttakPanel>
    </RawIntlProvider>
  );
};

export default UttakProsessIndex;
