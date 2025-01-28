import type { Kodeverk } from '../../../shared/Kodeverk.ts';
import { type VilkårDtoVilkarStatus as typeUnion, VilkårDtoVilkarStatus as enumObj } from '../../generated';

export type VilkårStatus = typeUnion;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus = enumObj;
