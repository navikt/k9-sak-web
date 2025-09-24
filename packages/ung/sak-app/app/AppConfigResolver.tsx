import { ReactElement, useEffect } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { qFeatureToggles } from '@k9-sak-web/gui/featuretoggles/ung/qFeatureToggles.js';
import { useFeatureToggles } from '@k9-sak-web/gui/featuretoggles/useFeatureToggles.js';
import { requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';
import useGetEnabledApplikasjonContext from "./useGetEnabledApplikasjonContext";
import ApplicationContextPath from "@k9-sak-web/sak-app/src/app/ApplicationContextPath";
import { useUngKodeverkoppslag } from "@k9-sak-web/gui/kodeverk/oppslag/useUngKodeverkoppslag.js";
import { UngKodeverkoppslagContext } from "@k9-sak-web/gui/kodeverk/oppslag/UngKodeverkoppslagContext.js";

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

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const { featureToggles } = useFeatureToggles();

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext()
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE)
  const ungKodeverkOppslag = useUngKodeverkoppslag(tilbakeAktivert) // Legg til klage her når det er klart

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    !ungKodeverkOppslag.isPending &&
    !!featureToggles;

  return (
    <FeatureTogglesContext.Provider value={featureToggles ?? qFeatureToggles}>
      <UngKodeverkoppslagContext value={ungKodeverkOppslag}>
        {harFeilet || erFerdig ? children : <LoadingPanel />}
      </UngKodeverkoppslagContext>
    </FeatureTogglesContext.Provider>
  );
};

export default AppConfigResolver;
