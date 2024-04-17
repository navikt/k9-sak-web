import { KodeverkType, KodeverkV2, KodeverkKlageType } from '.';

export type KodeverkMedUndertype = {
  [key: string]: KodeverkV2[];
};

export type AlleKodeverk = {
  [key in KodeverkType | KodeverkKlageType]?: KodeverkV2[] | KodeverkMedUndertype;
};
