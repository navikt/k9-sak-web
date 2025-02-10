import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Kodeverk } from './kodeverkTsType';

export interface OverlappendePeriode {
  ytelseType: FagsakYtelsesType;
  kilde: Kodeverk;
  overlappendePerioder: { fom: string; tom: string }[];
}
