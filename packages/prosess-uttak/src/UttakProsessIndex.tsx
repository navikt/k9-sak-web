import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import Uttak from './components/Uttak';
import BehandlingPersonMap from './components/types/BehandlingPersonMap';
import UttakPanel from './components/UttakPanel';
import Uttaksplaner from './components/dto/Uttaksplaner';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakProsessIndexProps {
  uttaksplaner: Uttaksplaner;
  behandlingPersonMap: BehandlingPersonMap;
}

const UttakProsessIndex: FunctionComponent<UttakProsessIndexProps> = ({ uttaksplaner, behandlingPersonMap }) => {
  return (
    <RawIntlProvider value={intl}>
      <UttakPanel>
        <Uttak uttaksplaner={uttaksplaner} behandlingPersonMap={behandlingPersonMap} />
      </UttakPanel>
    </RawIntlProvider>
  );
};

export default UttakProsessIndex;
