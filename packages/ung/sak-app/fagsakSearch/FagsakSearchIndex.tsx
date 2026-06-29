import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { KodeverkMedNavn } from '@k9-sak-web/types';

import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import FagsakSøkSakIndexV2 from '@k9-sak-web/gui/sak/fagsakSøk/FagsakSøkSakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { pathToFagsak } from '../app/paths';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import { UngSakBackendClient } from '../data/UngSakBackendClient';

const api = new UngSakBackendClient();

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
  const goToFagsak = async (saksnummer: string) => {
    await navigate(pathToFagsak(saksnummer));
  };

  const {
    mutate: searchFagsaker,
    data: fagsaker = [],
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ searchString }: { searchString?: string }) => api.fagsakSøk(searchString ?? ''),
    onSuccess: results => {
      if (results.length === 1) {
        void goToFagsak(results[0].saksnummer);
      }
    },
    // Sidan forbidden feil er handtert eksplisitt ønsker vi ikkje å kaste den vidare
    onError: err => {
      if (!(err instanceof ExtendedApiError && err.isForbidden)) {
        throw err;
      }
    },
  });

  const searchResultAccessDenied = useMemo(() => {
    // I ung sak backend blir det levert tilbake eigendefinert ManglerTilgangException for søkFagsaker endepunktet.
    if (error instanceof ExtendedApiError && error.isForbidden) {
      return {
        feilmelding: error.bodyFeilmelding ?? error.message,
      };
    }
    return undefined;
  }, [error]);

  const fagsakerV2 = JSON.parse(JSON.stringify(fagsaker));
  konverterKodeverkTilKode(fagsakerV2, false);

  return (
    <KodeverkProvider behandlingType={undefined} kodeverk={alleKodeverk}>
      <FagsakSøkSakIndexV2
        fagsaker={fagsakerV2}
        searchFagsakCallback={searchFagsaker}
        searchResultReceived={isSuccess}
        selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
        searchStarted={isPending}
        searchResultAccessDenied={searchResultAccessDenied}
      />
    </KodeverkProvider>
  );
};

export default FagsakSearchIndex;
