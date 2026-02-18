import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import type { Fagsak } from '../types/Fagsak';
import FagsakList from './FagsakList';
import styles from './fagsakSearch.module.css';
import SearchForm from './SearchForm';

interface OwnProps {
  fagsaker: Fagsak[];
  searchFagsakCallback: () => void;
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
        Søket ga ingen treff
      </BodyShort>
    )}

    <div className="mt-2">
      {fagsaker.length > 1 && <FagsakList fagsaker={fagsaker} selectFagsakCallback={selectFagsakCallback} />}
    </div>
  </div>
);

export default FagsakSearch;
