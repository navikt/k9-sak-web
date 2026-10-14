import { Period } from '@fpsak-frontend/utils';
import type { SykdomInnleggelseEndringBegrunnelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/sykdom/SykdomInnleggelseDto.js';

export interface InnleggelsesperiodeEndringRad {
  period: Period;
  begrunnelse: string;
  opprinneligPeriode: Period | null;
}

export const erRadNyEllerEndret = (periode: Period, opprinneligPeriode: Period | null): boolean =>
  !opprinneligPeriode || opprinneligPeriode.fom !== periode.fom || opprinneligPeriode.tom !== periode.tom;

export const byggEndringer = (
  aktiveRader: InnleggelsesperiodeEndringRad[],
  slettedeRader: InnleggelsesperiodeEndringRad[],
): SykdomInnleggelseEndringBegrunnelseDto[] => [
  ...aktiveRader
    .filter(rad => erRadNyEllerEndret(rad.period, rad.opprinneligPeriode))
    .map(rad => ({
      fraPeriode: rad.opprinneligPeriode ?? undefined,
      tilPeriode: rad.period,
      begrunnelse: rad.begrunnelse,
    })),
  ...slettedeRader.map(rad => ({
    fraPeriode: rad.opprinneligPeriode ?? undefined,
    tilPeriode: undefined,
    begrunnelse: rad.begrunnelse,
  })),
];
