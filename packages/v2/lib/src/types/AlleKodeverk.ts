import { KodeverkType, KodeverkV2, KodeverkKlageType, KodeverkTilbakeType } from '.';

export type KodeverkMedUndertype = {
  [key: string]: KodeverkV2[];
};

export type AlleKodeverk = {
  [key in KodeverkType | KodeverkKlageType | KodeverkTilbakeType]?: KodeverkV2[] | KodeverkMedUndertype;
};
