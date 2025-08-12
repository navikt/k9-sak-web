import {
  type kodeverk_opptjening_OpptjeningAktivitetType as generatedOpptjeningAktivitetTypeEnumUnion,
  kodeverk_opptjening_OpptjeningAktivitetType,
} from '../generated';
import type { Kodeverk } from '../../shared/Kodeverk.js';

export type OpptjeningAktivitetType = generatedOpptjeningAktivitetTypeEnumUnion;

export type OpptjeningAktivitetTypeKodeverk = Kodeverk<OpptjeningAktivitetType, 'OPPTJENING_AKTIVITET_TYPE'>;

// Re-eksporterer generert enum const direkte
export { kodeverk_opptjening_OpptjeningAktivitetType as opptjeningAktivitetType };
