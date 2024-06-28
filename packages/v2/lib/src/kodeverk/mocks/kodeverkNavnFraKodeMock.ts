import type {
  AlleKodeverk,
  KodeverkKlageType,
  KodeverkNavnFraKodeType,
  KodeverkTilbakeType,
  KodeverkType,
} from '../types';
import { utledKodeverkNavnFraKode } from '../kodeverkUtils';

export const kodeverkNavnFraKodeMock = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkTilbakeType | KodeverkKlageType,
  alleKodeverk: AlleKodeverk,
  ukjentTekst?: string | undefined,
) => {
  const navn = utledKodeverkNavnFraKode(kode, alleKodeverk[kodeverkType] || [], ukjentTekst || 'Ukjent kodeverk');
  return navn;
};

export const getKodeverkNavnFraKodeFnMock =
  (allekodeverk: AlleKodeverk): KodeverkNavnFraKodeType =>
  (kode, kodeverkType, ukjentTekst?) =>
    kodeverkNavnFraKodeMock(kode, kodeverkType, allekodeverk, ukjentTekst);
