import { useContext } from 'react';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import type { AlleKodeverk, KodeverkMedUndertype } from '@k9-sak-web/lib/types/AlleKodeverk.js';
import {
  BehandlingType,
  type GetKodeverkNavnFraKodeFnType,
  type HentKodeverkForKodeType,
  type KodeverkNavnFraKodeType,
  type KodeverkNavnFraUndertypeKodeType,
} from '@k9-sak-web/lib/types/index.js';
import { KodeverkContext } from '../context/KodeverkContext';

export const useKodeverkContext = () => {
  const kodeverkContext = useContext(KodeverkContext);

  if (!kodeverkContext) {
    throw new Error('useKodeverkContext må brukes innenfor en KodeverkContext.Provider');
  }

  const { behandlingType, kodeverk, klageKodeverk, tilbakeKodeverk, setKodeverkContext } = kodeverkContext;

  const hentKodeverkForKode: HentKodeverkForKodeType = (kodeverkType, kilde = undefined) => {
    let kodeverkForKilde: AlleKodeverk | undefined;

    if (kilde !== undefined) {
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
    }
    if (kodeverkForKilde === undefined) {
      kodeverkForKilde = behandlingType === BehandlingType.KLAGE ? klageKodeverk : kodeverk;
    }
    console.log('kodeverk for kilde', kodeverkForKilde);

    if (kodeverkForKilde && kodeverkForKilde[kodeverkType]) return kodeverkForKilde[kodeverkType];

    return [];
  };

  const hentKodeverkForUndertype = (kode: string, kodeverkForType: KodeverkMedUndertype) => kodeverkForType[kode] || [];

  const kodeverkNavnFraKode: KodeverkNavnFraKodeType = (
    kode,
    kodeverkType,
    kilde = undefined,
    ukjentTekst = undefined,
  ) => {
    console.log('kodeverk for ', kode, kodeverkType, kilde);
    const kodeverkForType = hentKodeverkForKode(kodeverkType, kilde);
    console.log('kodeverkfortype', kodeverkForType);
    if (kodeverkForType) return utledKodeverkNavnFraKode(kode, kodeverkForType);
    return ukjentTekst || 'Ukjent kode';
  };

  const kodeverkNavnFraUndertypeKode: KodeverkNavnFraUndertypeKodeType = (
    kode,
    undertypeKode,
    kodeverkType,
    kilde = undefined,
    ukjentTekst = undefined,
  ) => {
    const kodeverkForType = hentKodeverkForKode(kodeverkType, kilde);
    if (kodeverkForType && typeof kodeverkForType === 'object') {
      const kodeverkForUndertype = hentKodeverkForUndertype(kode, kodeverkForType as KodeverkMedUndertype);
      return utledKodeverkNavnFraUndertypeKode(undertypeKode, kodeverkForUndertype);
    }
    return ukjentTekst || 'Ukjent kode';
  };

  /*
   * Returnerer en funksjon for oppslag i kodeverk som kan sendes ned til eldre komponenter som for eksempel
   * ikke har tilgang til kodeverkContext eller ikke kan bruke hooks
   */
  const getKodeverkNavnFraKodeFn: GetKodeverkNavnFraKodeFnType = (kilde = undefined) => {
    let kodeverkForKilde: AlleKodeverk | undefined;

    if (kilde !== undefined) {
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
    }

    if (kodeverkForKilde === undefined) {
      kodeverkForKilde = behandlingType === BehandlingType.KLAGE ? klageKodeverk : kodeverk;
    }

    if (kodeverkForKilde === undefined) {
      return (kode, kodeverkType, ukjentTekst = undefined) => {
        console.error(`Ukjent kodeverk (${kode}, ${kodeverkType})`);
        return ukjentTekst || 'Ukjent kodeverk';
      };
    }
    return (kode, kodeverkType, ukjentTekst = undefined) => {
      console.log('kodeverkForKilde', kode, kodeverkType);
      const kodeverkForType = kodeverkForKilde[kodeverkType];
      if (kodeverkForType) return utledKodeverkNavnFraKode(kode, kodeverkForType, ukjentTekst);
      return ukjentTekst || 'Ukjent kodeverk';
    };
  };

  return {
    behandlingType,
    kodeverk,
    klageKodeverk,
    tilbakeKodeverk,
    kodeverkNavnFraKode,
    kodeverkNavnFraUndertypeKode,
    setKodeverkContext,
    getKodeverkNavnFraKodeFn,
    hentKodeverkForKode,
  };
};
