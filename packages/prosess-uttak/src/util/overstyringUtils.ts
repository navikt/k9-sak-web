import dayjs from 'dayjs';
import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';
import {
  Arbeidsforhold,
  OverstyrUttakFormData,
  OverstyrUttakFormDataUtbetalingsgrad,
  OverstyringUttak,
} from '../types';
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
      organisasjonsnummer:
        aktivitet[OverstyrUttakFormFieldName.ARBEIDSFORHOLD][OverstyrUttakFormFieldName.ORGANISASJONSNUMMER],
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
      organisasjonsnummer: aktivitet.orgnr,
      aktørId: aktivitet.aktørId,
      arbeidsforholdId: aktivitet.arbeidsforholdId,
    },
    aktivitetUtbetalingsgrad: undefined,
  }));
