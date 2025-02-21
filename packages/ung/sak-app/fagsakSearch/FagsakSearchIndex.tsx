import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { errorOfType, ErrorTypes, getErrorResponseData } from '@k9-sak-web/rest-api';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';

import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import FagsakSøkSakIndexV2 from '@k9-sak-web/gui/sak/fagsakSøk/FagsakSøkSakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { pathToFagsak } from '../app/paths';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

const EMPTY_ARRAY = [];

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: [KodeverkMedNavn] }>(
    UngSakApiKeys.KODEVERK,
  );

  const navigate = useNavigate();
  const { removeErrorMessages } = useRestApiErrorDispatcher();
  const goToFagsak = async (saksnummer: string) => {
    removeErrorMessages();
    await navigate(pathToFagsak(saksnummer));
  };

  const {
    startRequest: searchFagsaker,
    data: fagsaker = EMPTY_ARRAY,
    state: sokeStatus,
    error,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(UngSakApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = useMemo(
    () => (error && errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(error) : undefined),
    [error],
  );

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      void goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker]);

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
        searchResultAccessDenied={searchResultAccessDenied}
      />
    </KodeverkProvider>
  );
};

export default FagsakSearchIndex;
