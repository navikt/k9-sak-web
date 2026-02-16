import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Kodeverk } from './kodeverkTsType';

export interface OverlappendePeriode {
  ytelseType: FagsakYtelsesType;
  kilde: Kodeverk;
  overlappendePerioder: { fom: string; tom: string }[];
}
