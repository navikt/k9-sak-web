import {
  type k9_kodeverk_behandling_FagsakYtelseType as generatedFagsakYtelseTypeEnumUnion,
  k9_kodeverk_behandling_FagsakYtelseType as generatedFagsakYtelseType,
} from '../generated/types.ts';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type FagsakYtelsesType = generatedFagsakYtelseTypeEnumUnion;

// Oppretter Kodeverk type med verdier frå openapi generert union type
export type FagsakYtelsesTypeKodeverk = Kodeverk<FagsakYtelsesType, 'FAGSAK_YTELSE'>;

// Eksporter generert enum konstant
export const fagsakYtelsesType = generatedFagsakYtelseType;
