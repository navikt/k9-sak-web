import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import type { BehandlingAppKontekst } from '@k9-sak-web/types';
import { useMemo } from 'react';
import ApplicationContextPath from '../app/ApplicationContextPath';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import useBehandlingEndret from '../behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

const useHentAlleBehandlinger = (
  saksnummer: string,
  behandlingId: number,
  behandlingVersjon: number,
  oppfriskIndikator: number,
): [alleBehandlinger: BehandlingAppKontekst[], harHentet: boolean] => {
  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandlingVersjon);
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalHenteFraKlage = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);

  const { data: behandlingerK9Sak, state: behandlingerK9SakState } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    K9sakApiKeys.BEHANDLINGER_K9SAK,
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
    K9sakApiKeys.BEHANDLINGER_TILBAKE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon, oppfriskIndikator],
      suspendRequest: !saksnummer || !skalHenteFraTilbake || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const { data: behandlingerKlage, state: behandlingerKlageState } = restApiHooks.useRestApi<BehandlingAppKontekst[]>(
    K9sakApiKeys.BEHANDLINGER_KLAGE,
    { saksnummer },
    {
      updateTriggers: [saksnummer, behandlingId, behandlingVersjon, oppfriskIndikator],
      suspendRequest: !saksnummer || !skalHenteFraKlage || erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const harHentetK9Sak =
    !!behandlingerK9Sak ||
    (behandlingerK9SakState !== RestApiState.NOT_STARTED && behandlingerK9SakState !== RestApiState.LOADING);
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    !!behandlingerTilbake ||
    (behandlingerTilbakeState !== RestApiState.NOT_STARTED && behandlingerTilbakeState !== RestApiState.LOADING);
  const harHentetKlage =
    !skalHenteFraKlage ||
    !!behandlingerKlage ||
    (behandlingerKlageState !== RestApiState.NOT_STARTED && behandlingerKlageState !== RestApiState.LOADING);

  const alleBehandlinger = useMemo(
    () => [...(behandlingerK9Sak || []), ...(behandlingerTilbake || []), ...(behandlingerKlage || [])],
    [behandlingerK9Sak, behandlingerTilbake, behandlingerKlage],
  );

  return [alleBehandlinger, harHentetK9Sak && harHentetTilbake && harHentetKlage];
};

export default useHentAlleBehandlinger;
