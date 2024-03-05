import { KodeverkType } from '@k9-sak-web/gui/kodeverk/index.js';
import { Kodeverk } from './Kodeverk';

export type AlleKodeverk = {
  [key in KodeverkType]: Kodeverk[];
};
