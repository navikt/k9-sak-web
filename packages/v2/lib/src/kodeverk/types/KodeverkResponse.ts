import type { KodeverkKlageType, KodeverkType, KodeverkV2 } from '../types';

export type KodeverkResponse = {
  [key in KodeverkType | KodeverkKlageType]: KodeverkV2[];
};
