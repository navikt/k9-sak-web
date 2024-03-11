import { KodeverkService } from '../generated';

type KodeverkServiceHentBehandlendeEnheterMethod = KodeverkService['hentBehandlendeEnheter'];

export type YtelsesType = Exclude<Parameters<KodeverkServiceHentBehandlendeEnheterMethod>[0], undefined>;

// Typesikker måte å lage ein "enum" frå union type generert frå backend.
// Sikrer at vi er i synk med backend definisjoner.
const ytelsesTyper: Record<YtelsesType, YtelsesType> = {
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

export default ytelsesTyper;
