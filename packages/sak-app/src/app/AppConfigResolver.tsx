import { ReactElement, useEffect } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useFeatureToggles } from '@k9-sak-web/gui/featuretoggles/useFeatureToggles.js';
import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';
import { prodFeatureToggles } from '@k9-sak-web/gui/featuretoggles/prodFeatureToggles.js';
import { useK9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.jsx';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import ApplicationContextPath from './ApplicationContextPath';
import { InnloggetAnsattProvider } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { K9SakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/K9SakInnloggetAnsattBackendClient.js';

interface OwnProps {
  children: ReactElement<any>;
}

const NO_PARAMS = {};

/**
 * Komponent som henter backend-data som skal kunne aksesseres globalt i applikasjonen. Denne dataen blir kun hentet en gang.
 */
const AppConfigResolver = ({ children }: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  useEffect(() => {
    requestApi.setAddErrorMessageHandler(addErrorMessage);
  }, []);

  const [harHentetFerdigInitLenker, harK9sakInitKallFeilet] = useHentInitLenker();

  const options = {
    suspendRequest: harK9sakInitKallFeilet || !harHentetFerdigInitLenker,
    updateTriggers: [harHentetFerdigInitLenker],
  };

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const { featureToggles } = useFeatureToggles();

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const klageAktivert = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const k9KodeverkOppslag = useK9Kodeverkoppslag(klageAktivert, tilbakeAktivert);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    !!featureToggles; // <- sjekker at feature toggles er lasta

  return (
    <FeatureTogglesContext.Provider value={featureToggles ?? prodFeatureToggles}>
      <K9KodeverkoppslagContext value={k9KodeverkOppslag}>
        <InnloggetAnsattProvider api={new K9SakInnloggetAnsattBackendClient()}>
          {harFeilet || erFerdig ? children : <LoadingPanel />}
        </InnloggetAnsattProvider>
      </K9KodeverkoppslagContext>
    </FeatureTogglesContext.Provider>
  );
};

export default AppConfigResolver;
