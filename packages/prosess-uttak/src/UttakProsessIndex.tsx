import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import Uttak from './pleiepenger/Uttak';
import Behandlinger from './pleiepenger/types/UttakTypes';
import BehandlingPersonMap from './pleiepenger/types/BehandlingPersonMap';
import UttakPanel from './pleiepenger/UttakPanel';

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
