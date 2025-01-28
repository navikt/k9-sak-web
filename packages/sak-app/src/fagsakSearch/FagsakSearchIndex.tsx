import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';
import { errorOfType, ErrorTypes, getErrorResponseData } from '@k9-sak-web/rest-api';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';

import FagsakSøkSakIndexV2 from '@k9-sak-web/gui/sak/fagsakSøk/FagsakSøkSakIndex.js';
import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
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

  const featureToggles = useContext(FeatureTogglesContext);

  const navigate = useNavigate();
  const { removeErrorMessages } = useRestApiErrorDispatcher();
  const goToFagsak = (saksnummer: string) => {
    removeErrorMessages();
    navigate(pathToFagsak(saksnummer));
  };

  const {
    startRequest: searchFagsaker,
    data: fagsaker = EMPTY_ARRAY,
    state: sokeStatus,
    error,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(K9sakApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = useMemo(
    () => (error && errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(error) : undefined),
    [error],
  );

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker]);

  if (featureToggles?.BRUK_V2_SAK_SOK) {
    const fagsakerV2 = JSON.parse(JSON.stringify(fagsaker));
    konverterKodeverkTilKode(fagsakerV2, false);
    return (
      <FagsakSøkSakIndexV2
        fagsaker={fagsakerV2}
        searchFagsakCallback={searchFagsaker}
        searchResultReceived={sokFerdig}
        selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
        searchStarted={sokeStatus === RestApiState.LOADING}
        searchResultAccessDenied={searchResultAccessDenied}
      />
    );
  }

  return (
    <FagsakSokSakIndex
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsaker}
      searchResultReceived={sokFerdig}
      selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
      searchStarted={sokeStatus === RestApiState.LOADING}
      searchResultAccessDenied={searchResultAccessDenied}
      alleKodeverk={alleKodeverk}
    />
  );
};

export default FagsakSearchIndex;
