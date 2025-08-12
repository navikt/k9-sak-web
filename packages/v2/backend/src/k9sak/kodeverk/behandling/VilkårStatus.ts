import type { Kodeverk } from '../../../shared/Kodeverk.ts';
import { type kodeverk_vilkår_Utfall as typeUnion, kodeverk_vilkår_Utfall as enumObj } from '../../generated';

export type VilkårStatus = typeUnion;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus = enumObj;
