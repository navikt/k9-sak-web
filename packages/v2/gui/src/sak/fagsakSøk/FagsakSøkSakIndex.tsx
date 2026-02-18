import React from 'react';
import FagsakSearch from './components/FagsakSearch';
import type { Fagsak } from './types/Fagsak';

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
 * NB! Denne komponenten blir kun brukt lokalt. I alle andre miljø brukes K9LOS
 */
const FagsakSøkSakIndexV2 = ({
  fagsaker = [],
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted = false,
  searchResultAccessDenied,
}: OwnProps) => (
  <FagsakSearch
    fagsaker={fagsaker}
    searchFagsakCallback={searchFagsakCallback}
    searchResultReceived={searchResultReceived}
    selectFagsakCallback={selectFagsakCallback}
    searchStarted={searchStarted}
    searchResultAccessDenied={searchResultAccessDenied}
  />
);

export default FagsakSøkSakIndexV2;
