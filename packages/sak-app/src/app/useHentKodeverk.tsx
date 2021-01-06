import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import ApplicationContextPath from './ApplicationContextPath';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';

const NO_PARAMS = {};

const useHentKodeverk = (skalHenteKodeverk: boolean): boolean => {
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const skalHenteFraKlage = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);

  const { state: kodeverkK9SakStatus } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.KODEVERK, NO_PARAMS, {
    suspendRequest: !skalHenteKodeverk,
    updateTriggers: [skalHenteKodeverk],
  });
  const { state: kodeverkTilbakeStatus } = restApiHooks.useGlobalStateRestApi(
    K9sakApiKeys.KODEVERK_TILBAKE,
    NO_PARAMS,
    {
      suspendRequest: !skalHenteFraTilbake || !skalHenteKodeverk,
      updateTriggers: [skalHenteKodeverk],
    },
  );
  const { state: kodeverkKlageStatus } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.KODEVERK_KLAGE, NO_PARAMS, {
    suspendRequest: !skalHenteFraKlage || !skalHenteKodeverk,
    updateTriggers: [skalHenteKodeverk],
  });

  const harHentetK9Sak =
    kodeverkK9SakStatus !== RestApiState.NOT_STARTED && kodeverkK9SakStatus !== RestApiState.LOADING;
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    (kodeverkTilbakeStatus !== RestApiState.NOT_STARTED && kodeverkTilbakeStatus !== RestApiState.LOADING);
  const harHentetKlage =
    !skalHenteFraKlage ||
    (kodeverkKlageStatus !== RestApiState.NOT_STARTED && kodeverkKlageStatus !== RestApiState.LOADING);

  return harHentetK9Sak && harHentetTilbake && harHentetKlage;
};

export default useHentKodeverk;
