import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import FagsakList from './FagsakList';
import SearchForm from './SearchForm';

import styles from './fagsakSearch.module.css';

interface OwnProps {
  fagsaker: Fagsak[];
  searchFagsakCallback: () => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (e: React.SyntheticEvent, saksnummer: string) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
  alleKodeverk: { [key: string]: [KodeverkMedNavn] };
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
  alleKodeverk,
}: OwnProps) => (
  <div className={styles.container} data-testid="FagsakSearch">
    <SearchForm
      onSubmit={searchFagsakCallback}
      // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
    />

    {searchResultReceived && fagsaker.length === 0 && (
      <BodyShort size="small" className={styles.label}>
        <FormattedMessage id="FagsakSearch.ZeroSearchResults" />
      </BodyShort>
    )}

    <VerticalSpacer eightPx />

    {fagsaker.length > 1 && (
      <FagsakList fagsaker={fagsaker} selectFagsakCallback={selectFagsakCallback} alleKodeverk={alleKodeverk} />
    )}
  </div>
);

export default FagsakSearch;
