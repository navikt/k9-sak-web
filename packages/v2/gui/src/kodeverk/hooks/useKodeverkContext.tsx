import { useContext } from 'react';
import { utledKodeverkNavnFraKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkKlageType } from '@k9-sak-web/lib/types/KodeverkKlageType.js';
import { KodeverkTilbakeType } from '@k9-sak-web/lib/types/KodeverkTilbakeType.js';
import { KodeverkContext } from '../context/KodeverkContext';

export const useKodeverkContext = () => {
  const kodeverkContext = useContext(KodeverkContext);

  if (!kodeverkContext) {
    throw new Error('useKodeverkContext må brukes innenfor en KodeverkContext.Provider');
  }

  const { kodeverk, klageKodeverk, tilbakeKodeverk, setKodeverkContext } = kodeverkContext;

  const kodeverkNavnFraKode = (
    kode: string,
    kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' = 'kodeverk',
  ) => {
    if (kodeverk !== undefined) {
      console.log('oppslag i context', kode, kodeverkType);
      return utledKodeverkNavnFraKode(kode, kodeverkType, kodeverk);
    }
    return 'Ukjent kode';
  };

  /*
   * Returnerer en funksjon for oppslag i kodeverk som kan sendes ned til eldre komponenter som for eksempel
   * ikke har tilgang til kodeverkContext eller ikke kan bruke hooks
   */
  const getKodeverkNavnFraKodeFn = (kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' = 'kodeverk') => {
    let kodeverkForKilde;
    switch (kilde) {
      case 'kodeverkTilbake':
        kodeverkForKilde = tilbakeKodeverk;
        break;
      case 'kodeverkKlage':
        kodeverkForKilde = klageKodeverk;
        break;
      case 'kodeverk':
      default:
        kodeverkForKilde = kodeverk;
        break;
    }

    if (kodeverkForKilde === undefined) {
      return (kode: string, kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType) => {
        console.error(`Ukjent kodeverk (${kode}, ${kodeverkType})`);
        return 'Ukjent kodeverk';
      };
    }
    return (kode: string, kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType) =>
      utledKodeverkNavnFraKode(kode, kodeverkType, kodeverkForKilde);
  };
  return {
    kodeverk,
    klageKodeverk,
    tilbakeKodeverk,
    kodeverkNavnFraKode,
    setKodeverkContext,
    getKodeverkNavnFraKodeFn,
  };
};
