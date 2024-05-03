import React, { ReactElement, useEffect } from 'react';

import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { LoadingPanel } from '@k9-sak-web/shared-components';

import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';

interface OwnProps {
  children: ReactElement;
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

  const { state: featureToggleState } = restApiHooks.useGlobalStateRestApi<{
    featureToggles: { [key: string]: boolean };
  }>(
    K9sakApiKeys.FEATURE_TOGGLE,
    {},
    {
      ...options,
      suspendRequest: options.suspendRequest,
    },
  );

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    (featureToggleState === RestApiState.NOT_STARTED || featureToggleState === RestApiState.SUCCESS);

  return harFeilet || erFerdig ? children : <LoadingPanel />;
};

export default AppConfigResolver;
