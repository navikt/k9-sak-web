import {
  type OpptjeningAktivitetDtoAktivitetType as generatedOpptjeningAktivitetTypeEnumUnion,
  OpptjeningAktivitetDtoAktivitetType,
} from '../generated';
import type { Kodeverk } from '../../shared/Kodeverk.js';

export type OpptjeningAktivitetType = generatedOpptjeningAktivitetTypeEnumUnion;

export type OpptjeningAktivitetTypeKodeverk = Kodeverk<OpptjeningAktivitetType, 'OPPTJENING_AKTIVITET_TYPE'>;

// Re-eksporterer generert enum const direkte
export { OpptjeningAktivitetDtoAktivitetType as opptjeningAktivitetType };
