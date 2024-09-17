import { KodeverkKlageType, KodeverkTilbakeType, KodeverkType } from '../types';

export type KodeverkNavnFraKodeFnType = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  ukjentTekst?: string | undefined,
) => string;

export type GetKodeverkNavnFraKodeFnType = (
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
) => KodeverkNavnFraKodeFnType;
