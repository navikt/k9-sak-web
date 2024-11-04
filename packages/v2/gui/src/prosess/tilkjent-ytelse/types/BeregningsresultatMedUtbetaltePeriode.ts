import type { BeregningsresultatPeriodeDto } from './BeregningsresultatPeriodeDto';

export type BeregningsresultatMedUtbetaltePeriodeDto = {
  opphoersdato?: string;
  perioder?: Array<BeregningsresultatPeriodeDto>;
  skalHindreTilbaketrekk?: boolean;
};
