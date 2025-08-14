import type { Kodeverk } from '../../../shared/Kodeverk.ts';
import { type k9_kodeverk_vilkår_Utfall as typeUnion, k9_kodeverk_vilkår_Utfall as enumObj } from '../../generated';

export type VilkårStatus = typeUnion;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus = enumObj;
