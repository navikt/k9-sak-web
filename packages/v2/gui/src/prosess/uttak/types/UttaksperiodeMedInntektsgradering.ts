import type { InntektgraderingPeriodeDto, Periode, UttaksperiodeInfo } from '@k9-sak-web/backend/k9sak/generated';

export interface Uttaksperiode extends UttaksperiodeInfo {
  periode: Periode;
  harOppholdTilNestePeriode?: boolean;
}

export interface UttaksperiodeMedInntektsgradering extends Uttaksperiode {
  inntektsgradering?: InntektgraderingPeriodeDto | undefined;
}
