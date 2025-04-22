import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { useMemo } from 'react';

import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';

const useHentAlleBehandlinger = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
  oppfriskIndikator: number,
): [alleBehandlinger: BehandlingAppKontekst[], harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);

  const { data: behandlingerK9Sak, state: behandlingerK9SakState } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    UngSakApiKeys.BEHANDLINGER_UNGSAK,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon, oppfriskIndikator],
      suspendRequest: !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetK9Sak =
    !!behandlingerK9Sak ||
    (behandlingerK9SakState !== RestApiState.NOT_STARTED && behandlingerK9SakState !== RestApiState.LOADING);

  const alleBehandlinger = useMemo(() => [...(behandlingerK9Sak || [])], [behandlingerK9Sak]);

  return [alleBehandlinger, harHentetK9Sak];
};

export default useHentAlleBehandlinger;
