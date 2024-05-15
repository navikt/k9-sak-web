import { useContext } from 'react';
import { utledKodeverkNavnFraKode, utledKodeverkNavnFraUndertypeKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkKlageType } from '@k9-sak-web/lib/types/KodeverkKlageType.js';
import { KodeverkTilbakeType } from '@k9-sak-web/lib/types/KodeverkTilbakeType.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { AlleKodeverk } from '@k9-sak-web/lib/types/AlleKodeverk.js';
import { KodeverkContext } from '../context/KodeverkContext';

export const useKodeverkContext = () => {
  const kodeverkContext = useContext(KodeverkContext);

  if (!kodeverkContext) {
    throw new Error('useKodeverkContext må brukes innenfor en KodeverkContext.Provider');
  }

  const { behandlingType, kodeverk, klageKodeverk, tilbakeKodeverk, setKodeverkContext } = kodeverkContext;

  const hentKodeverkForKode = (
    kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined = undefined,
  ) => {
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

    if (kodeverkForKilde === undefined)
      kodeverkForKilde = behandlingType === BehandlingType.KLAGE ? klageKodeverk : kodeverk;

    if (kodeverkForKilde && kodeverkForKilde[kodeverkType]) return kodeverkForKilde[kodeverkType];

    return [];
  };

  const kodeverkNavnFraKode = (
    kode: string,
    kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined = undefined,
    ukjentTekst: string | undefined = undefined,
  ) => {
    console.log(
      `Oppslag i context.  --  kode: ${kode}  --  kodeverkType: ${kodeverkType}  --  Behandlingstype: ${behandlingType}`,
    );
    const kodeverkForType = hentKodeverkForKode(kodeverkType, kilde);
    if (kodeverkForType) return utledKodeverkNavnFraKode(kode, kodeverkForType);
    return ukjentTekst || 'Ukjent kode';
  };

  const kodeverkNavnFraUndertypeKode = (
    kode: string,
    undertypeKode: string,
    kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined = undefined,
    ukjentTekst: string | undefined = undefined,
  ) => {
    console.log(
      `Undertype, oppslag i context.  --  kode: ${kode}  --  kodeverkType: ${kodeverkType} -- undertypeKode: ${undertypeKode}  --  Behandlingstype: ${behandlingType}`,
    );

    const kodeverkForType = hentKodeverkForKode(kodeverkType, kilde);
    if (kodeverkForType) {
      return utledKodeverkNavnFraUndertypeKode(undertypeKode, kodeverkForType);
    }
    return ukjentTekst || 'Ukjent kode';
  };

  /*
   * Returnerer en funksjon for oppslag i kodeverk som kan sendes ned til eldre komponenter som for eksempel
   * ikke har tilgang til kodeverkContext eller ikke kan bruke hooks
   */
  const getKodeverkNavnFraKodeFn = (
    kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined = undefined,
  ) => {
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
      return (kode: string, kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType) => {
        console.error(`Ukjent kodeverk (${kode}, ${kodeverkType})`);
        return 'Ukjent kodeverk';
      };
    }
    return (
      kode: string,
      kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
      ukjentTekst: string | undefined = undefined,
    ) => {
      const kodeverkForType = kodeverkForKilde[kodeverkType];
      if (kodeverkForType) return utledKodeverkNavnFraKode(kode, kodeverkForType, ukjentTekst);
      return ukjentTekst || 'Ukjent kodeverk';
    };
  };

  return {
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
