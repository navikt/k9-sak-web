import dayjs from 'dayjs';
import * as Yup from 'yup';

import {
  Arbeidsforhold,
  OverstyrUttakFormData,
  OverstyrUttakFormDataUtbetalingsgrad,
  OverstyringUttak,
} from '../types';
import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';
import { FormatertOverstyring } from '../types/FormatertOverstyring';

export const formaterOverstyringTilFormData = (overstyring: OverstyringUttak): OverstyrUttakFormData => ({
  [OverstyrUttakFormFieldName.FOM]: overstyring.periode.fom,
  [OverstyrUttakFormFieldName.TOM]: overstyring.periode.tom,
  [OverstyrUttakFormFieldName.UTTAKSGRAD]: overstyring.søkersUttaksgrad,
  [OverstyrUttakFormFieldName.BEGRUNNELSE]: overstyring.begrunnelse,
  [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: overstyring.utbetalingsgrader.map(utbetalingsgrad => ({
    [OverstyrUttakFormFieldName.ARBEIDSFORHOLD]: utbetalingsgrad.arbeidsforhold,
    [OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD]: utbetalingsgrad.utbetalingsgrad,
  })),
});

export const formaterOverstyring = (values: OverstyrUttakFormData): FormatertOverstyring => ({
  begrunnelse: values[OverstyrUttakFormFieldName.BEGRUNNELSE],
  periode: {
    fom: dayjs(values[OverstyrUttakFormFieldName.FOM]).format('YYYY-MM-DD'),
    tom: dayjs(values[OverstyrUttakFormFieldName.TOM]).format('YYYY-MM-DD'),
  },
  søkersUttaksgrad: values[OverstyrUttakFormFieldName.UTTAKSGRAD],
  utbetalingsgrader: values[OverstyrUttakFormFieldName.UTBETALINGSGRADER].map(aktivitet => ({
    arbeidsforhold: {
      type: aktivitet[OverstyrUttakFormFieldName.ARBEIDSFORHOLD][OverstyrUttakFormFieldName.TYPE],
      orgnr: aktivitet[OverstyrUttakFormFieldName.ARBEIDSFORHOLD][OverstyrUttakFormFieldName.ORGNR],
      aktørId: aktivitet[OverstyrUttakFormFieldName.ARBEIDSFORHOLD][OverstyrUttakFormFieldName.AKTØR_ID],
      arbeidsforholdId:
        aktivitet[OverstyrUttakFormFieldName.ARBEIDSFORHOLD][OverstyrUttakFormFieldName.ARBEIDSFORHOLD_ID],
    },
    utbetalingsgrad: aktivitet[OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD],
  })),
});

export const formaterOverstyringAktiviteter = (aktiviteter: Arbeidsforhold[]): OverstyrUttakFormDataUtbetalingsgrad[] =>
  aktiviteter.map(aktivitet => ({
    arbeidsforhold: {
      type: aktivitet.type,
      orgnr: aktivitet.orgnr,
      aktørId: aktivitet.aktørId,
      arbeidsforholdId: aktivitet.arbeidsforholdId,
    },
    aktivitetUtbetalingsgrad: undefined,
  }));

export const yupValiderProsent = Yup
  .number()
  .transform((val, orig) => orig === "" ? undefined : val)
  .typeError("Må være et tall")
  .max(100, "Maks 100")
  .min(0, "Minst 0");

export const overstyrUttakFormValidationSchema = Yup.object().shape({
  [OverstyrUttakFormFieldName.UTTAKSGRAD]: yupValiderProsent,
  [OverstyrUttakFormFieldName.FOM]: Yup.string().required('Feltet er påkrevd'),
  [OverstyrUttakFormFieldName.TOM]: Yup.string().required('Feltet er påkrevd'),
  [OverstyrUttakFormFieldName.BEGRUNNELSE]: Yup
    .string()
    .required('Feltet er påkrevd')
    .min(5, "Du må skirve minst 5 tegn")
    .max(1500, "Du kan skrive maksimalt 1500 tegn"),
  [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: Yup.array().of(
    Yup.object().shape({
      [OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD]: yupValiderProsent,
      [OverstyrUttakFormFieldName.ARBEIDSFORHOLD]: Yup.object().shape({
        [OverstyrUttakFormFieldName.TYPE]: Yup.string().nullable(),
        [OverstyrUttakFormFieldName.ORGNR]: Yup.string().nullable(),
        [OverstyrUttakFormFieldName.AKTØR_ID]: Yup.string().nullable(),
        [OverstyrUttakFormFieldName.ARBEIDSFORHOLD_ID]: Yup.string().nullable(),
      }),
    })),
});