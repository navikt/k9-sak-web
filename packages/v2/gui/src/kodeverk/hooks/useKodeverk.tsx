import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkResponse } from '@k9-sak-web/lib/types/KodeverkResponse.js';
import { AlleKodeverk } from '@k9-sak-web/lib/types/AlleKodeverk.js';

export const useKodeverkV2 = () => {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(K9sakApiKeys.KODEVERK);

  const kodeverkNavnFraKode = (kode: string, kodeverkType: KodeverkType, undertypeKode?: string) => {
    if (alleKodeverk) {
      if (undertypeKode) {
        if (alleKodeverk[kodeverkType]) {
          return utledKodeverkNavnFraUndertypeKode(undertypeKode, alleKodeverk[kodeverkType]);
        }
        return 'Ukjent kodeverkstype';
      }
      return utledKodeverkNavnFraKode(kode, kodeverkType, alleKodeverk as AlleKodeverk);
    }
    return '';
  };

  const hentKodeverkForType = (kodeverkType: KodeverkType) => {
    if (alleKodeverk) {
      return alleKodeverk[kodeverkType];
    }
    return [];
  };

  return { kodeverkNavnFraKode, hentKodeverkForType };
};
