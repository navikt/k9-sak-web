import { KodeverkKlageType, KodeverkType, type KodeverkV2 } from '.';

export type KodeverkResponse = {
  [key in KodeverkType | KodeverkKlageType]: KodeverkV2[];
};
