import dayjs from 'dayjs';
import * as Yup from 'yup';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { yupValiderProsent } from '@k9-sak-web/lib/validationUtils/yupSchemas.js';
import {
  OverstyrUttakArbeidsforholdDtoType,
  type ArbeidsgiverOversiktDto,
  type OverstyrUttakArbeidsforholdDto,
  type OverstyrUttakPeriodeDto,
  type OverstyrUttakUtbetalingsgradDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);

export const utledAktivitetNavn = (
  arbeidsforhold: OverstyrUttakArbeidsforholdDto,
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'],
): string => {
  if (arbeidsforhold.type === OverstyrUttakArbeidsforholdDtoType.KUN_YTELSE) return arbeidstypeTilVisning.BA;

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
  const startDatoer = perioderTilVurdering.map(periodeString => dayjs(periodeString.split('/')[0]));
  return new Date(Math.min(...startDatoer.map(date => date.valueOf())));
};

export const finnSisteSluttDatoFraPerioderTilVurdering = (perioderTilVurdering: string[]): Date => {
  const sluttDatoer = perioderTilVurdering.map(periodeString => dayjs(periodeString.split('/')[1]));
  return new Date(Math.max(...sluttDatoer.map(date => date.valueOf())));
};

export const formaterOverstyringAktiviteter = (
  aktiviteter: OverstyrUttakArbeidsforholdDto[],
): OverstyrUttakUtbetalingsgradDto[] =>
  aktiviteter.map(aktivitet => ({
    arbeidsforhold: {
      type: (aktivitet.type as OverstyrUttakArbeidsforholdDtoType) || OverstyrUttakArbeidsforholdDtoType.ANNET,
      orgnr: aktivitet.orgnr,
      aktørId: aktivitet.aktørId,
      arbeidsforholdId: aktivitet.arbeidsforholdId,
    },
    utbetalingsgrad: 0,
  }));

export const overstyrUttakFormValidationSchema = Yup.object().shape({
  søkersUttaksgrad: yupValiderProsent,
  periode: Yup.object().shape({
    fom: Yup.string().required('Feltet er påkrevd'),
    tom: Yup.string().required('Feltet er påkrevd'),
  }),
  begrunnelse: Yup.string()
    .required('Feltet er påkrevd')
    .min(5, 'Du må skrive minst 5 tegn')
    .max(1500, 'Du kan skrive maksimalt 1500 tegn'),
  utbetalingsgrader: Yup.array().of(
    Yup.object().shape({
      utbetalingsgrad: yupValiderProsent.required('Feltet er påkrevd'),
      arbeidsforhold: Yup.object().shape({
        type: Yup.string().nullable(),
        orgnr: Yup.string().nullable(),
        aktørId: Yup.string().nullable(),
        arbeidsforholdId: Yup.string().nullable(),
      }),
    }),
  ),
});
