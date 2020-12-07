import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';
import ApplicationContextPath from './ApplicationContextPath';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.FPSAK];

  const kodeverkFpTilbake = restApiHooks.useGlobalStateRestApiData(FpsakApiKeys.KODEVERK_FPTILBAKE);

  if (kodeverkFpTilbake) {
    enabledApplicationContexts.push(ApplicationContextPath.FPTILBAKE);
  }

  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;
