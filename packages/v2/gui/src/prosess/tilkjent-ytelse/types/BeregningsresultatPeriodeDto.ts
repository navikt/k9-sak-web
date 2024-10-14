import type { NyPeriodeFormAndeler } from '../components/manuellePerioder/FormState';

export type BeregningsresultatPeriodeDto = {
  andeler: Array<NyPeriodeFormAndeler>;
  dagsats: number | null;
  fom: string;
  reduksjonsfaktorInaktivTypeA?: number;
  tom: string;
  totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt?: number;
  totalUtbetalingsgradFraUttak?: number;
};
