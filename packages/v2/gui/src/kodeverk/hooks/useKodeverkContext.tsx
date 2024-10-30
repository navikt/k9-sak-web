import { useContext } from 'react';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import type { AlleKodeverk, KodeverkMedUndertype } from '@k9-sak-web/lib/kodeverk/types/AlleKodeverk.js';
import {
  type GetKodeverkNavnFraKodeFnType,
  type HentKodeverkForKodeType,
  type KodeverkNavnFraKodeType,
  type KodeverkNavnFraUndertypeKodeType,
} from '@k9-sak-web/lib/kodeverk/types';
import { behandlingType as klageBehandlingstyper } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { KodeverkContext } from '../context/KodeverkContext';

export const useKodeverkContext = () => {
  const kodeverkContext = useContext(KodeverkContext);

  if (!kodeverkContext) {
    throw new Error('useKodeverkContext må brukes innenfor en KodeverkContext.Provider');
  }

  const { behandlingType, kodeverk, klageKodeverk, tilbakeKodeverk } = kodeverkContext;

  const hentKodeverkForKode: HentKodeverkForKodeType = (kodeverkType, kilde) => {
    let kodeverkForKilde: AlleKodeverk | undefined;

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
      kodeverkForKilde = behandlingType === klageBehandlingstyper.KLAGE ? klageKodeverk : kodeverk;
    }

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
    const kodeverkForType = hentKodeverkForKode(kodeverkType, kilde);
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
  const getKodeverkNavnFraKodeFn: GetKodeverkNavnFraKodeFnType = kilde => {
    let kodeverkForKilde: AlleKodeverk | undefined;

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
      kodeverkForKilde = behandlingType === klageBehandlingstyper.KLAGE ? klageKodeverk : kodeverk;
    }

    if (kodeverkForKilde === undefined) {
      return (kode, kodeverkType, ukjentTekst = undefined) => {
        console.error(`Ukjent kodeverk (${kode}, ${kodeverkType})`);
        return ukjentTekst || 'Ukjent kodeverk';
      };
    }
    return (kode, kodeverkType, ukjentTekst = undefined) => {
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
    getKodeverkNavnFraKodeFn,
    hentKodeverkForKode,
  };
};
