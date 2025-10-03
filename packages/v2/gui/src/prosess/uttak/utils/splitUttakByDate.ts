import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';

export interface SplitResult {
  before: UttaksperiodeBeriket[];
  afterOrCovering: UttaksperiodeBeriket[];
}

export const splitUttakByDate = (
  uttaksperioder: UttaksperiodeBeriket[],
  virkningsdatoUttakNyeRegler: string | undefined,
): SplitResult => {
  if (!uttaksperioder || uttaksperioder.length === 0) {
    return { before: [], afterOrCovering: [] };
  }
  if (!virkningsdatoUttakNyeRegler) {
    return { before: uttaksperioder, afterOrCovering: [] };
  }

  const parsed = new Date(virkningsdatoUttakNyeRegler);
  const virkningsdato = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  const before: UttaksperiodeBeriket[] = [];
  const afterOrCovering: UttaksperiodeBeriket[] = [];

  for (const uttak of uttaksperioder) {
    const from = new Date(uttak.periode.fom);
    const to = new Date(uttak.periode.tom);
    if (to < virkningsdato) before.push(uttak);
    else if (from >= virkningsdato || (from < virkningsdato && to >= virkningsdato)) afterOrCovering.push(uttak);
  }

  return { before, afterOrCovering };
};

export default splitUttakByDate;
