import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';

const NO_PARAMS = {};

const useHentKodeverk = (skalHenteKodeverk: boolean): boolean => {
  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const skalHenteFraTilbake = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const { state: kodeverkUngSakStatus } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.KODEVERK, NO_PARAMS, {
    suspendRequest: !skalHenteKodeverk,
    updateTriggers: [skalHenteKodeverk],
  });

  const { state: kodeverkTilbakeStatus } = restApiHooks.useGlobalStateRestApi(
    UngSakApiKeys.KODEVERK_TILBAKE,
    NO_PARAMS,
    {
      suspendRequest: !skalHenteFraTilbake || !skalHenteKodeverk,
      updateTriggers: [skalHenteKodeverk],
    },
  );

  const harHentetUngSak =
    kodeverkUngSakStatus !== RestApiState.NOT_STARTED && kodeverkUngSakStatus !== RestApiState.LOADING;
  const harHentetTilbake =
    !skalHenteFraTilbake ||
    (kodeverkTilbakeStatus !== RestApiState.NOT_STARTED && kodeverkTilbakeStatus !== RestApiState.LOADING);

  return harHentetUngSak && harHentetTilbake;
};

export default useHentKodeverk;
