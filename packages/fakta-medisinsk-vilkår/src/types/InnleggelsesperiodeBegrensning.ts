import { Period } from '@fpsak-frontend/utils';

export interface InnleggelsesperiodeBegrensning {
  søknadsperiode: Period;
  hullIPeriode: { from: string; to: string }[];
  sammenhengendePerioder: Period[];
}

