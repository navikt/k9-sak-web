import { BodyShort, Box } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import FagsakList from './FagsakList';
import SearchForm from './SearchForm';

import type { FagsakDto } from '@k9-sak-web/backend/k9sak/generated';
import styles from './fagsakSearch.module.css';

interface OwnProps {
  fagsaker: FagsakDto[];
  searchFagsakCallback: (saksnummer: string) => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (e: React.SyntheticEvent, saksnummer: string) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
}

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch = ({
  fagsaker,
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted,
  searchResultAccessDenied,
}: OwnProps) => (
  <div className={styles.container} data-testid="FagsakSearch">
    <SearchForm
      onSubmit={searchFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
    />

    {searchResultReceived && fagsaker.length === 0 && (
      <BodyShort size="small" className={styles.label}>
        <FormattedMessage id="FagsakSearch.ZeroSearchResults" />
      </BodyShort>
    )}

    {fagsaker.length > 1 && (
      <Box marginBlock={'2 0'}>
        <FagsakList fagsaker={fagsaker} selectFagsakCallback={selectFagsakCallback} />
      </Box>
    )}
  </div>
);

export default FagsakSearch;
