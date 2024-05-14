import React, { useState } from 'react';

import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { KodeverkResponse } from '@k9-sak-web/lib/types/KodeverkResponse.js';
import { AlleKodeverk, KodeverkKlageType, KodeverkType } from '@k9-sak-web/lib/types/index.ts';

export const useKodeverkV2 = (kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined) => {
  const [alleKodeverk, setAlleKodeverk] = useState<KodeverkResponse | undefined>(undefined);
  const [alleKodeverkTilbake, setAlleKodeverkTilbake] = useState<KodeverkResponse | undefined>(undefined);
  const [alleKodeverkKlage, setAlleKodeverkKlage] = useState<KodeverkResponse | undefined>(undefined);

  const hentAlleKodeverk = async () =>
    // kodeverkKilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage'
    {
      let kodeverkResponse;

      switch (kilde) {
        case 'kodeverkTilbake':
          kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(
            K9sakApiKeys.KODEVERK_TILBAKE,
          );
          setAlleKodeverkTilbake(kodeverkResponse);
          break;
        case 'kodeverkKlage':
          kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(
            K9sakApiKeys.KODEVERK_KLAGE,
          );
          setAlleKodeverkKlage(kodeverkResponse);
          break;
        default:
          kodeverkResponse = await restApiHooks.useGlobalStateRestApiData<KodeverkResponse>(K9sakApiKeys.KODEVERK);
          setAlleKodeverk(kodeverkResponse);
          break;
      }
      return kodeverkResponse;
    };

  /*
   * Note to self / TODO
   * Har her lagt opp til alle kodeverk i ett oppslag, men det er mulig det må legges til en mulighet for
   * flere ulike oppslag. Da det kanskje er forskjellige sett med kodeverk, for eksempel for TILBAKE.
   */
  const kodeverkNavnFraKode = (
    kode: string,
    kodeverkType: KodeverkType | KodeverkKlageType,
    undertypeKode?: string | null,
    kodeverkKilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' = 'kodeverk',
  ) => {
    // let kodeverkForKilde;
    const kodeverkForKilde = alleKodeverk || hentAlleKodeverk();
    // switch (kodeverkKilde) {
    //   case 'kodeverkTilbake':
    //     kodeverkForKilde = alleKodeverkTilbake || ( hentAlleKodeverk());
    //     break;

    //   case 'kodeverkKlage':
    //     kodeverkForKilde = alleKodeverkKlage || ( hentAlleKodeverk());
    //     break;

    //   case 'kodeverk':
    //   default:
    //     kodeverkForKilde = alleKodeverk || ( hentAlleKodeverk());
    //     break;
    // }

    if (kodeverkForKilde) {
      if (undertypeKode) {
        // if (kodeverkForKilde[kodeverkType]) {
        //   return kodeverkForKilde[kodeverkType]
        //     ? utledKodeverkNavnFraUndertypeKode(undertypeKode, kodeverkForKilde[kodeverkType])
        //     : 'Ukjent kodeverkstype';
        // }
      }
      // return utledKodeverkNavnFraKode(kode, kodeverkType, kodeverkForKilde);
    }

    return 'Ukjent kodeverk';
  };

  const getKodeverkNavnFraKodeFn = async (
    kodeverkKilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' = 'kodeverk',
  ) => {
    let kodeverkForKilde;
    switch (kodeverkKilde) {
      case 'kodeverkTilbake':
        kodeverkForKilde = alleKodeverkTilbake || (await hentAlleKodeverk());
        break;

      case 'kodeverkKlage':
        kodeverkForKilde = alleKodeverkKlage || (await hentAlleKodeverk());
        break;

      case 'kodeverk':
      default:
        kodeverkForKilde = alleKodeverk || (await hentAlleKodeverk());
        break;
    }
    console.log('etablerer kodeverkNavnFraKodeFn');
    return (kode: string, kodeverkType: KodeverkType | KodeverkKlageType, undertypeKode?: string) => {
      console.log('bruker kodeverknavnFraKodeFn', kodeverkForKilde);
      if (kodeverkForKilde) {
        if (undertypeKode) {
          if (kodeverkForKilde[kodeverkType]) {
            return kodeverkForKilde[kodeverkType]
              ? utledKodeverkNavnFraUndertypeKode(undertypeKode, kodeverkForKilde[kodeverkType])
              : 'Ukjent kodeverkstype';
          }
        }
        return utledKodeverkNavnFraKode(kode, kodeverkType, kodeverkForKilde);
      }

      return 'Ukjent kodeverk';
    };
  };

  const hentKodeverkForType = (kodeverkType: KodeverkType) => {
    if (alleKodeverk) {
      return alleKodeverk[kodeverkType];
    }
    return [];
  };

  return {
    kodeverkNavnFraKode,
    hentKodeverkForType,
    getKodeverkNavnFraKodeFn,
    alleKodeverk,
    alleKodeverkKlage,
    alleKodeverkTilbake,
  };
};

export default useKodeverkV2;
