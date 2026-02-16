import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  k9_kodeverk_vilkår_Utfall as enumObj,
  type k9_kodeverk_vilkår_Utfall as typeUnion,
} from '../../generated/types.js';

export type VilkårStatus = typeUnion;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus = enumObj;
