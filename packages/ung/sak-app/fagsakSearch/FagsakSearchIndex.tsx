import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { errorOfType, ErrorTypes, getErrorResponseData } from '@k9-sak-web/rest-api';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { FagsakYtelseType } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakYtelseType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import FagsakSøkSakIndexV2 from '@k9-sak-web/gui/sak/fagsakSøk/FagsakSøkSakIndex.js';
import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
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
  const { removeErrorMessages } = useRestApiErrorDispatcher();
  const goToFagsak = async (saksnummer: string) => {
    removeErrorMessages();
    await navigate(pathToFagsak(saksnummer));
  };

  const {
    mutate: searchFagsaker,
    data: fagsaker = [],
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ searchString }: { searchString?: string }) =>
      api.fagsakSøk(
        searchString ?? '',
        isAktivitetspenger() ? FagsakYtelseType.AKTIVITETSPENGER : FagsakYtelseType.UNGDOMSYTELSE,
      ),
    onSuccess: results => {
      if (results.length === 1) {
        void goToFagsak(results[0].saksnummer);
      }
    },
  });

  const searchResultAccessDenied = useMemo(
    () => (error && errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(error) : undefined),
    [error],
  );

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
