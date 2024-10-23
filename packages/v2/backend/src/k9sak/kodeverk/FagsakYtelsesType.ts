import {
  type fagsakYtelseType as generatedFagsakYtelseTypeEnumUnion,
  fagsakYtelseType as generatedFagsakYtelseType,
} from '../generated';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type FagsakYtelsesType = generatedFagsakYtelseTypeEnumUnion;

// Oppretter Kodeverk type med verdier frå openapi generert union type
export type FagsakYtelsesTypeKodeverk = Kodeverk<FagsakYtelsesType, 'FAGSAK_YTELSE'>;

// Eksporter generert enum konstant
export const fagsakYtelsesType = generatedFagsakYtelseType;
