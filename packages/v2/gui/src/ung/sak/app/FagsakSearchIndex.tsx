import type { FagsakDto } from '@k9-sak-web/backend/k9sak/generated';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FagsakSearch from '../sok/FagsakSearch';
import { pathToFagsak } from './paths';
import type UngSakBackendClient from './UngSakBackendClient';

interface FagsakSearchIndexProps {
  ungSakBackendClient: UngSakBackendClient;
}

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex = ({ ungSakBackendClient }: FagsakSearchIndexProps) => {
  const navigate = useNavigate();
  // const { removeErrorMessages } = useRestApiErrorDispatcher();
  const goToFagsak = (saksnummer: string) => {
    // removeErrorMessages();
    navigate(pathToFagsak(saksnummer));
  };

  const searchFagsakerMutation = useMutation({
    mutationFn: ({ saksnummer }: { saksnummer: string }): Promise<FagsakDto[]> =>
      ungSakBackendClient.søkFagsak(saksnummer),
  });

  const searchFagsaker = (saksnummer: string) => searchFagsakerMutation.mutate({ saksnummer });

  // const searchResultAccessDenied = useMemo(
  //   () => (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(error) : undefined),
  //   [error],
  // );

  const { isSuccess: søkSuccess, isPending: søkLoading, data: fagsaker = [], error: søkError } = searchFagsakerMutation;

  useEffect(() => {
    if (søkSuccess && fagsaker[0] && fagsaker.length === 1) {
      goToFagsak(fagsaker[0].saksnummer);
    }
  }, [søkSuccess, fagsaker]);

  //TODO: sjekk alle feilmeldinger
  const searchResultAccessDenied = søkError?.message ? { feilmelding: søkError?.message } : undefined;

  return (
    <FagsakSearch
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsaker}
      searchResultReceived={søkSuccess}
      selectFagsakCallback={(e, saksnummer: string) => goToFagsak(saksnummer)}
      searchStarted={søkLoading}
      searchResultAccessDenied={searchResultAccessDenied}
    />
  );
};

export default FagsakSearchIndex;
