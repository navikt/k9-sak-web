import { Location } from 'history';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { Historikkinnslag, KodeverkMedNavn } from '@k9-sak-web/types';
import { getKodeverknavnFn } from '@k9-sak-web/utils';

import messages from '../i18n/nb_NO.json';
import History from './components/History';

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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  erTilbakekreving: boolean;
}

const HistorikkSakIndex = ({
  historikkinnslag,
  saksnummer,
  getBehandlingLocation,
  alleKodeverk,
  createLocationForSkjermlenke,
  erTilbakekreving,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <History
      historikkinnslag={historikkinnslag}
      saksnummer={saksnummer}
      getBehandlingLocation={getBehandlingLocation}
      getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
      erTilbakekreving={erTilbakekreving}
    />
  </RawIntlProvider>
);

export default HistorikkSakIndex;
