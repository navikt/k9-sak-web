import {
  type k9_kodeverk_opptjening_OpptjeningAktivitetType as generatedOpptjeningAktivitetTypeEnumUnion,
  k9_kodeverk_opptjening_OpptjeningAktivitetType,
} from '../generated/types.js';
import type { Kodeverk } from '../../shared/Kodeverk.js';

export type OpptjeningAktivitetType = generatedOpptjeningAktivitetTypeEnumUnion;

export type OpptjeningAktivitetTypeKodeverk = Kodeverk<OpptjeningAktivitetType, 'OPPTJENING_AKTIVITET_TYPE'>;

// Re-eksporterer generert enum const direkte
export { k9_kodeverk_opptjening_OpptjeningAktivitetType as opptjeningAktivitetType };
