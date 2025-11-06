import type { BeregningsresultatPeriodeDto } from './BeregningsresultatPeriodeDto';
import type { Feriepengegrunnlag } from './feriepenger.js';

export type BeregningsresultatMedUtbetaltePeriodeDto = {
  opphoersdato?: string;
  perioder?: Array<BeregningsresultatPeriodeDto>;
  skalHindreTilbaketrekk?: boolean;
  feriepengegrunnlag?: Feriepengegrunnlag | null;
};
