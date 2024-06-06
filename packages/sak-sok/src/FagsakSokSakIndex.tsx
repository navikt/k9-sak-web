import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Fagsak } from '@k9-sak-web/types';

import FagsakSearch from './components/FagsakSearch';
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
  fagsaker?: Fagsak[];
  searchFagsakCallback: () => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (e: React.SyntheticEvent, saksnummer: string) => void;
  searchStarted?: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
}

/*
 * NB! Denne komponenten blir kun brukt lokalt. I alle andre miljø brukes FPLOS
 */
const FagsakSokSakIndex = ({
  fagsaker = [],
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted = false,
  searchResultAccessDenied,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <FagsakSearch
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsakCallback}
      searchResultReceived={searchResultReceived}
      selectFagsakCallback={selectFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
    />
  </RawIntlProvider>
);

export default FagsakSokSakIndex;
