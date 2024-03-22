import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkResponse } from '@k9-sak-web/lib/types/KodeverkResponse.js';
import { AlleKodeverk } from '@k9-sak-web/lib/types/AlleKodeverk.js';
import { useState } from 'react';

export const useKodeverkV2 = () => {
  const [alleKodeverk, setAlleKodeverk] = useState<KodeverkResponse | undefined>(undefined);
  const [alleKodeverkTilbake, setAlleKodeverkTilbake] = useState<KodeverkResponse | undefined>(undefined);
  const [alleKodeverkKlage, setAlleKodeverkKlage] = useState<KodeverkResponse | undefined>(undefined);

  const hentAlleKodeverk = async (kodeverkKilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage') => {
    let kodeverkResponse;
    switch (kodeverkKilde) {
      case 'kodeverkTilbake':
        kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(
          K9sakApiKeys.KODEVERK_TILBAKE,
        );
        setAlleKodeverkTilbake(kodeverkResponse);
        break;
      case 'kodeverkKlage':
        kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(K9sakApiKeys.KODEVERK_KLAGE);
        setAlleKodeverk(kodeverkResponse);
        break;
      default:
        kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(K9sakApiKeys.KODEVERK);
        setAlleKodeverkKlage(kodeverkResponse);
        break;
    }
  };

  /*
   * Note to self / TODO
   * Har her lagt opp til alle kodeverk i ett oppslag, men det er mulig det må legges til en mulighet for
   * flere ulike oppslag. Da det kanskje er forskjellige sett med kodeverk, for eksempel for TILBAKE.
   */

  const kodeverkNavnFraKode = async (
    kode: string,
    kodeverkType: KodeverkType,
    undertypeKode?: string,
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' = 'kodeverk',
  ) => {
    if (!alleKodeverk) await hentAlleKodeverk(kilde);

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

  return { kodeverkNavnFraKode, hentKodeverkForType, alleKodeverk, alleKodeverkKlage, alleKodeverkTilbake };
};
