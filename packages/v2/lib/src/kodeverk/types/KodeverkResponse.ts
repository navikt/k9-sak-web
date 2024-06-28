import { KodeverkKlageType, KodeverkType, type KodeverkV2 } from '../types';

export type KodeverkResponse = {
  [key in KodeverkType | KodeverkKlageType]: KodeverkV2[];
};
