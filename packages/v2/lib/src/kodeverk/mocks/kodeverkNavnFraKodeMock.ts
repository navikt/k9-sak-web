import { utledKodeverkNavnFraKode } from '../kodeverkUtils';
import type {
  AlleKodeverk,
  KodeverkKlageType,
  KodeverkNavnFraKodeType,
  KodeverkTilbakeType,
  KodeverkType,
  KodeverkTypeV2,
} from '../types';

export const kodeverkNavnFraKodeMock = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkTilbakeType | KodeverkKlageType | KodeverkTypeV2,
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
