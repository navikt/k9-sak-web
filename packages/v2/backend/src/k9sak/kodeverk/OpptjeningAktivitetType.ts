import {
  type opptjeningAktivitetType2 as generatedOpptjeningAktivitetTypeEnumUnion,
  opptjeningAktivitetType2,
} from '../generated';
// ^- opptjeningAktivitetType (uten 2) er generert frå kalkulus type, så skal ikkje brukast her
import type { Kodeverk } from '../../shared/Kodeverk.js';

export type OpptjeningAktivitetType = generatedOpptjeningAktivitetTypeEnumUnion;

export type OpptjeningAktivitetTypeKodeverk = Kodeverk<OpptjeningAktivitetType, 'OPPTJENING_AKTIVITET_TYPE'>;

// Re-eksporterer generert enum const direkte
export { opptjeningAktivitetType2 as opptjeningAktivitetType };
