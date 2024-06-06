import { KodeverkKlageType, KodeverkTilbakeType, KodeverkType } from '.';

export type KodeverkNavnFraUndertypeKodeType = (
  kode: string,
  undertypeKode: string,
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  kilde: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
  ukjentTekst: string | undefined,
) => string;
