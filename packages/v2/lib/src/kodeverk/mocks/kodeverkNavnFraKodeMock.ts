import { AlleKodeverk, KodeverkKlageType, KodeverkTilbakeType, KodeverkType } from '../../types';
import { utledKodeverkNavnFraKode } from '../kodeverkUtils';

export const kodeverkNavnFraKodeMock = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkTilbakeType | KodeverkKlageType,
  alleKodeverk: AlleKodeverk,
  ukjentTekst?: string | undefined,
) => {
  console.log(`MOCK: kodeverkoppslag, kode: ${kode}, kodeverkType: ${kodeverkType}`, alleKodeverk[kodeverkType]);
  return utledKodeverkNavnFraKode(
    kode,
    alleKodeverk[kodeverkType] || [],
    `${ukjentTekst || 'Ukjent kodeverk'}: ${kode} (${kodeverkType})`,
  );
};

export const getKodeverkNavnFraKodeFnMock =
  (allekodeverk: AlleKodeverk) =>
  (
    kode: string,
    kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
    ukjentTekst?: string | undefined,
  ) =>
    kodeverkNavnFraKodeMock(kode, kodeverkType, allekodeverk, ukjentTekst);
