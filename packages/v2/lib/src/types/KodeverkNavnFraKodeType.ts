import { KodeverkKlageType, KodeverkTilbakeType, KodeverkType } from '.';

export type KodeverkNavnFraKodeType = (
  kode: string,
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
  ukjentTekst?: string | undefined,
) => string;
