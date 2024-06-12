import { KodeverkKlageType, KodeverkMedUndertype, KodeverkTilbakeType, KodeverkType, KodeverkV2 } from '.';

export type HentKodeverkForKodeType = (
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
) => KodeverkV2[] | KodeverkMedUndertype | undefined;
