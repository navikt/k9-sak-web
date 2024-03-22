import { KodeverkType, KodeverkV2 } from '.';

export type KodeverkResponse = {
  [key in KodeverkType]: KodeverkV2[];
};
