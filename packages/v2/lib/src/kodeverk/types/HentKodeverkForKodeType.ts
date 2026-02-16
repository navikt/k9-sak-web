import type {
  KodeverkKlageType,
  KodeverkMedUndertype,
  KodeverkTilbakeType,
  KodeverkType,
  KodeverkTypeV2,
  KodeverkV2,
} from '../types';

export type HentKodeverkForKodeType = (
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType | KodeverkTypeV2,
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
) => KodeverkV2[] | KodeverkMedUndertype | undefined;
