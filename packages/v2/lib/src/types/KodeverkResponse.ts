import { KodeverkKlageType, KodeverkType, KodeverkV2 } from '.';

export type KodeverkResponse = {
  [key in KodeverkType | KodeverkKlageType]: KodeverkV2[];
};
