import { KodeverkType, KodeverkV2 } from '.';

export type AlleKodeverk = {
  [key in KodeverkType]: KodeverkV2[];
};
