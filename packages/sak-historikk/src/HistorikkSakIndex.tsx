import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Location } from 'history';
import { Historikkinnslag } from '@k9-sak-web/types';
import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/types/index.js';

import History from './components/History';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  historikkinnslag: Historikkinnslag;
  saksnummer?: string;
  getBehandlingLocation: (behandlingId: number) => Location;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  erTilbakekreving: boolean;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
}

const HistorikkSakIndex = ({
  historikkinnslag,
  saksnummer,
  getBehandlingLocation,
  createLocationForSkjermlenke,
  erTilbakekreving,
  kodeverkNavnFraKodeFn,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <History
      historikkinnslag={historikkinnslag}
      saksnummer={saksnummer}
      getBehandlingLocation={getBehandlingLocation}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
      erTilbakekreving={erTilbakekreving}
      kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
    />
  </RawIntlProvider>
);

export default HistorikkSakIndex;
