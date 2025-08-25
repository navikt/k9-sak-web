import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { useMemo } from 'react';

import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';

const useHentAlleBehandlinger = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
  oppfriskIndikator: number,
): [alleBehandlinger: BehandlingAppKontekst[], harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);

  const { data: behandlingerUngSak, state: behandlingerUngSakState } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    UngSakApiKeys.BEHANDLINGER_UNGSAK,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon, oppfriskIndikator],
      suspendRequest: !saksnummer || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const { data: behandlingerTilbake, state: behandlingerTilbakeState } = restApiHooks.useRestApi<
    BehandlingAppKontekst[]
  >(
    UngSakApiKeys.BEHANDLINGER_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon, oppfriskIndikator],
      suspendRequest: !saksnummer || !skalHenteFraTilbake || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetUngSak =
    !!behandlingerUngSak ||
    (behandlingerUngSakState !== RestApiState.NOT_STARTED && behandlingerUngSakState !== RestApiState.LOADING);
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    !!behandlingerTilbake ||
    (behandlingerTilbakeState !== RestApiState.NOT_STARTED && behandlingerTilbakeState !== RestApiState.LOADING);

  const alleBehandlinger = useMemo(
    () => [...(behandlingerUngSak || []), ...(behandlingerTilbake || [])],
    [behandlingerUngSak, behandlingerTilbake],
  );

  return [alleBehandlinger, harHentetUngSak && harHentetTilbake];
};

export default useHentAlleBehandlinger;
