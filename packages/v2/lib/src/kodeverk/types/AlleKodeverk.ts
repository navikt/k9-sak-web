import type { KodeverkKlageType, KodeverkTilbakeType, KodeverkType, KodeverkV2 } from '../types';

export type KodeverkMedUndertype = {
  [key: string]: KodeverkV2[];
};

export type AlleKodeverk = {
  [key in KodeverkType | KodeverkKlageType | KodeverkTilbakeType]?: KodeverkV2[] | KodeverkMedUndertype | string[];
};
