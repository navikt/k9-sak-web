import { Period } from '@fpsak-frontend/utils';
import { SykdomInnleggelseEndringDto } from '../../../types/SykdomInnleggelseDto';

export interface InnleggelsesperiodeRad {
  period: Period;
  begrunnelse: string;
  opprinneligPeriode: Period | null;
}

export const erRadNyEllerEndret = (periode: Period, opprinneligPeriode: Period | null): boolean =>
  !opprinneligPeriode || opprinneligPeriode.fom !== periode.fom || opprinneligPeriode.tom !== periode.tom;

export const byggEndringer = (
  aktiveRader: InnleggelsesperiodeRad[],
  slettedeRader: InnleggelsesperiodeRad[],
): SykdomInnleggelseEndringDto[] => [
  ...aktiveRader
    .filter(rad => erRadNyEllerEndret(rad.period, rad.opprinneligPeriode))
    .map(rad => ({ fraPeriode: rad.opprinneligPeriode, tilPeriode: rad.period, begrunnelse: rad.begrunnelse })),
  ...slettedeRader.map(rad => ({ fraPeriode: rad.opprinneligPeriode, tilPeriode: null, begrunnelse: rad.begrunnelse })),
];
