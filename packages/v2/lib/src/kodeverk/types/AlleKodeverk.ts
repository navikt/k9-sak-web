import { KodeverkType, type KodeverkV2, KodeverkKlageType, KodeverkTilbakeType } from '../types';

export type KodeverkMedUndertype = {
  [key: string]: KodeverkV2[];
};

export type AlleKodeverk = {
  [key in KodeverkType | KodeverkKlageType | KodeverkTilbakeType]?: KodeverkV2[] | KodeverkMedUndertype | string[];
};
