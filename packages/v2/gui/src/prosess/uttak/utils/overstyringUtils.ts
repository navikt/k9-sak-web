import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { UttakArbeidType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/UttakArbeidType.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { OverstyrUttakArbeidsforholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakArbeidsforholdDto.js';
import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';
import type { OverstyrUttakUtbetalingsgradDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakUtbetalingsgradDto.js';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);

export const utledAktivitetNavn = (
  arbeidsforhold: OverstyrUttakArbeidsforholdDto,
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'],
): string => {
  if (arbeidsforhold.type === UttakArbeidType.KUN_YTELSE) return arbeidstypeTilVisning.BA;

  if (!arbeidsgivere || Object.keys(arbeidsgivere).length === 0) return '';

  let navn = '';
  for (const [ident, ag] of Object.entries(arbeidsgivere)) {
    if (
      ident === arbeidsforhold.aktørId ||
      ident === arbeidsforhold.arbeidsforholdId ||
      ident === arbeidsforhold.orgnr
    ) {
      navn = ag.navn || '';
    }
  }

  let navnId = '';
  if (arbeidsforhold.orgnr) navnId = ` (${arbeidsforhold.orgnr})`;
  else if (arbeidsforhold.aktørId) navnId = ` (${arbeidsforhold.aktørId})`;
  else if (arbeidsforhold.arbeidsforholdId) navnId = ` (${arbeidsforhold.arbeidsforholdId})`;
  else if (arbeidsforhold.type) navnId = ` (${arbeidsforhold.type})`;

  return navn && navnId ? `${navn}${navnId}` : navn;
};

export const erOverstyringInnenforPerioderTilVurdering = (
  overstyring: OverstyrUttakPeriodeDto,
  perioderTilVurdering: string[],
): boolean => {
  const overstyringStartDato = dayjs(overstyring.periode.fom);
  const overstyringSluttDato = dayjs(overstyring.periode.tom);

  return perioderTilVurdering.some(periodeString => {
    const [periodeStartStr, periodeSluttStr] = periodeString.split('/');
    const periodeStartDato = dayjs(periodeStartStr);
    const periodeSluttDato = dayjs(periodeSluttStr);

    return (
      (overstyringStartDato.isBefore(periodeSluttDato) || overstyringStartDato.isSame(periodeSluttDato, 'day')) &&
      (overstyringSluttDato.isAfter(periodeStartDato) || overstyringSluttDato.isSame(periodeStartDato, 'day'))
    );
  });
};

export const finnTidligsteStartDatoFraPerioderTilVurdering = (perioderTilVurdering: string[]): Date => {
  if (!perioderTilVurdering || perioderTilVurdering.length === 0) {
    return new Date();
  }
  const startDatoer = perioderTilVurdering
    .map(periodeString => periodeString.split('/')[0])
    .filter(Boolean)
    .map(d => initializeDate(d || ''));
  if (startDatoer.length === 0) return new Date();
  return new Date(Math.min(...startDatoer.map(date => date.valueOf())));
};

export const finnSisteSluttDatoFraPerioderTilVurdering = (perioderTilVurdering: string[]): Date => {
  if (!perioderTilVurdering || perioderTilVurdering.length === 0) {
    return new Date();
  }
  const sluttDatoer = perioderTilVurdering
    .map(periodeString => periodeString.split('/')[1])
    .filter(Boolean)
    .map(d => initializeDate(d || ''));
  if (sluttDatoer.length === 0) return new Date();
  return new Date(Math.max(...sluttDatoer.map(date => date.valueOf())));
};

export const formaterOverstyringAktiviteter = (
  aktiviteter: OverstyrUttakArbeidsforholdDto[],
): OverstyrUttakUtbetalingsgradDto[] =>
  aktiviteter.map(aktivitet => ({
    arbeidsforhold: {
      type: aktivitet.type ?? UttakArbeidType.ANNET,
      orgnr: aktivitet.orgnr,
      aktørId: aktivitet.aktørId,
      arbeidsforholdId: aktivitet.arbeidsforholdId,
    },
    utbetalingsgrad: 0,
  }));
