import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { kodeverkNavnFrakode } from '@k9-sak-web/lib/kodeverk/kodeverkNavnFraKode.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkResponse } from '@k9-sak-web/lib/types/KodeverkResponse.js';

export const useKodeverkV2 = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(K9sakApiKeys.KODEVERK);

  // TODO: Trenger vi undertype?
  const kodeverkNavnFraKode = (kode: string, kodeverkType: KodeverkType, undertype?: string) => {
    if (alleKodeverk) {
      return kodeverkNavnFrakode(kode, kodeverkType, alleKodeverk);
    }
    return `Fant ikke kodeverk for ${kode})`;
  };

  return { kodeverkNavnFraKode, alleKodeverk };
};
