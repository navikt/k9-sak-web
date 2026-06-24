import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';

import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import FagsakSøkSakIndexV2 from '@k9-sak-web/gui/sak/fagsakSøk/FagsakSøkSakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { pathToFagsak } from '../app/paths';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

const EMPTY_ARRAY = [];

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    K9sakApiKeys.KODEVERK,
  );

  const navigate = useNavigate();
  const goToFagsak = useCallback(
    async (saksnummer: string) => {
      await navigate(pathToFagsak(saksnummer));
    },
    [navigate],
  );

  const {
    startRequest: searchFagsaker,
    data: fagsaker = EMPTY_ARRAY,
    state: sokeStatus,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(K9sakApiKeys.SEARCH_FAGSAK);

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      void goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker, goToFagsak]);

  const fagsakerV2 = JSON.parse(JSON.stringify(fagsaker));
  konverterKodeverkTilKode(fagsakerV2, false);
  return (
    <KodeverkProvider behandlingType={undefined} kodeverk={alleKodeverk}>
      <FagsakSøkSakIndexV2
        fagsaker={fagsakerV2}
        searchFagsakCallback={searchFagsaker}
        searchResultReceived={sokFerdig}
        selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
        searchStarted={sokeStatus === RestApiState.LOADING}
      />
    </KodeverkProvider>
  );
};

export default FagsakSearchIndex;
