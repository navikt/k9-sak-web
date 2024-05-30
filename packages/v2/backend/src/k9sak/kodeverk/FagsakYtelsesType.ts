import { type FagsakDto } from '../generated';
import type { Kodeverk } from '../../shared/Kodeverk.ts';

export type FagsakYtelsesType = FagsakDto['sakstype'];

// Oppretter Kodeverk type med verdier frå openapi generert union type
export type FagsakYtelsesTypeKodeverk = Kodeverk<FagsakYtelsesType, 'FAGSAK_YTELSE'>;

// Typesikker måte å lage ein "enum" frå union type generert frå backend.
// Sikrer at vi er i synk med backend definisjoner.
export const fagsakYtelsesType: Readonly<Record<FagsakYtelsesType, FagsakYtelsesType>> = {
  DAG: 'DAG',
  FRISINN: 'FRISINN',
  SP: 'SP',
  PSB: 'PSB',
  PPN: 'PPN',
  OMP: 'OMP',
  OMP_KS: 'OMP_KS',
  OMP_MA: 'OMP_MA',
  OMP_AO: 'OMP_AO',
  OLP: 'OLP',
  AAP: 'AAP',
  ES: 'ES',
  FP: 'FP',
  SVP: 'SVP',
  EF: 'EF',
  OBSOLETE: 'OBSOLETE',
  '-': '-',
};
