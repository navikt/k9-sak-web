import { KodeverkKlageType, KodeverkTilbakeType, KodeverkType, KodeverkTypeV2 } from '../types';

export type KodeverkNavnFraKodeType = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType | KodeverkTypeV2,
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
  ukjentTekst?: string | undefined,
) => string;
