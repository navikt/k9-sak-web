import {
  KodeverkKlageType,
  type KodeverkMedUndertype,
  KodeverkTilbakeType,
  KodeverkType,
  type KodeverkV2,
} from '../types';

export type HentKodeverkForKodeType = (
  kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType,
  kilde?: 'kodeverk' | 'kodeverkTilbake' | 'kodeverkKlage' | undefined,
) => KodeverkV2[] | KodeverkMedUndertype | undefined;
