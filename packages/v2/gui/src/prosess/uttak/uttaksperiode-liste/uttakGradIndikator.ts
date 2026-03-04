import classNames from 'classnames/bind';
import { Årsak } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/Årsak.js';
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
  const erGradertMotInntekt = inntektsgraderinger?.perioder?.some(p => {
    return p.periode.fom === uttak.periode.fom && p.periode.tom === uttak.periode.tom;
  });

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
