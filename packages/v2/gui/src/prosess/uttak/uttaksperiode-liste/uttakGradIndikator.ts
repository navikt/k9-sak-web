import classNames from 'classnames/bind';
import { pleiepengerbarn_uttak_kontrakter_Årsak as Årsak } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { isPeriodCoveredByPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';
import styles from './uttak.module.css';

const cx = classNames.bind(styles);

// Årsaken AVKORTET_MOT_INNTEKT betyr at perioden er gradert mot ARBEIDSTID (!)
// Perioden er gradert mot inntekt om det foreligger en inntektsgradering (for perioden)
// Skal skraveres vertikalt om perioden er gradert mot inntekt |🟩|
// Skal være skravert diagonalt, om perioden er gradert mot tilsyn /🟩/
export const finnGraderingForUttak = (
  uttak: Pick<UttaksperiodeBeriket, 'periode' | 'årsaker'>,
  inntektsgraderinger?: { perioder?: { periode: { fom: string; tom: string } }[] } | null,
): {
  erGradertMotInntekt: boolean;
  erGradertMotTilsyn: boolean;
} => {
  // Siden vi må splitte ved årsskifte 2026-2027 for å legge infoboks om låsing av normalarbeidstid
  // så må vi sjekke om uttaksperioden dekkes av perioden med inntektsgradering
  // i stedet for å gjøre en direkte sammenligning på uttakperiode.fom === inntektsgradering.periode.fom og uttakperiode.tom === inntektsgradering.periode.tom
  const erGradertMotInntekt = inntektsgraderinger?.perioder?.some(p =>
    isPeriodCoveredByPeriod(uttak.periode, p.periode),
  );

  const erGradertMotTilsyn =
    !erGradertMotInntekt && (uttak.årsaker ?? []).some(årsak => årsak === Årsak.GRADERT_MOT_TILSYN);

  return {
    erGradertMotInntekt: !!erGradertMotInntekt,
    erGradertMotTilsyn,
  };
};

export const finnUttakGradIndikatorCls = (
  uttaksgrad: number | null | undefined,
  erGradertMotInntekt: boolean,
  erGradertMotTilsyn: boolean,
): string =>
  cx('uttakIndikator', {
    uttakIndikatorAvslått: uttaksgrad === 0, // Rød indikator 🟥
    uttakIndikatorInnvilget: (uttaksgrad ?? 0) > 0, // Grønn indikator 🟩
    uttakIndikatorInnvilgetDelvisInntekt: erGradertMotInntekt, // Vertikalt skravert indikator (grønn/hvit) |🟩|
    uttakIndikatorInnvilgetDelvis: erGradertMotTilsyn, // Diagonalt skravert indikator (grønn/hvit) /🟩/
  });
