import type { Kodeverk } from '../../../shared/Kodeverk.ts';
import {
  type vilkarStatus as generatedVilkarStatusEnumUnion,
  vilkarStatus as generatedVilkarStatusType,
} from '../../generated';

export type VilkårStatus = generatedVilkarStatusEnumUnion;

export type VilkårStatusKodeverk = Kodeverk<VilkårStatus, 'VILKAR_STATUS'>;

export const vilkårStatus = generatedVilkarStatusType;
