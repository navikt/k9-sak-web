import dayjs from 'dayjs';

import { Inntektskategori } from '@navikt/ft-kodeverk';
import type { ForlengelsePeriodeProp } from '../../types/Beregningsgrunnlag';
import type { FordelBeregningsgrunnlagPeriode } from '../../types/BeregningsgrunnlagFordeling';

function inneholderPeriode(p1?: { fom: string; tom?: string }, p2?: { fom: string; tom?: string }) {
  return (
    p2?.tom != null &&
    !dayjs(p2.tom).isBefore(dayjs(p1?.fom)) &&
    (p1?.tom == null || !dayjs(p2.tom).isAfter(dayjs(p1.tom)))
  );
}

function overlapper(periode1: { fom: string; tom?: string }, periode2?: { fom: string; tom?: string }): boolean {
  return inneholderPeriode(periode1, periode2) || inneholderPeriode(periode2, periode1);
}

export function erPeriodeTilVurdering(
  periode?: FordelBeregningsgrunnlagPeriode,
  forlengelseperioder?: ForlengelsePeriodeProp[],
): boolean {
  const finnesAndelUtenInntektskategori = periode?.fordelBeregningsgrunnlagAndeler?.some(
    andel => !andel.inntektskategori || andel.inntektskategori === Inntektskategori.UDEFINERT,
  ); // Quickfix: Grunnet feil i kopiering av grunnlag mangler noen andeler inntektskategori, disse må kunne fastsettes uansett forlengelse
  if (finnesAndelUtenInntektskategori) {
    return true;
  }
  return (
    !forlengelseperioder || forlengelseperioder.length === 0 || forlengelseperioder.some(fp => overlapper(fp, periode))
  );
}
