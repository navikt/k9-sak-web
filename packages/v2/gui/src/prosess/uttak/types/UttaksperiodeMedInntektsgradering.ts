import type {
  k9_sak_kontrakt_uttak_inntektgradering_InntektgraderingPeriodeDto as InntektgraderingPeriodeDto,
  k9_sak_typer_Periode as Periode,
  pleiepengerbarn_uttak_kontrakter_UttaksperiodeInfo as UttaksperiodeInfo,
} from '@k9-sak-web/backend/k9sak/generated';

export interface Uttaksperiode extends UttaksperiodeInfo {
  periode: Periode;
  harOppholdTilNestePeriode?: boolean;
}

export interface UttaksperiodeMedInntektsgradering extends Uttaksperiode {
  inntektsgradering?: InntektgraderingPeriodeDto | undefined;
}
