import {
  ArbeidsgiverOpplysninger,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatPeriode,
  BeregningsresultatPeriodeAndel,
} from '@k9-sak-web/types';
import { BeregningsresultatPeriodeDto } from '@navikt/k9-sak-typescript-client';

export interface BeriketBeregningsresultatPeriode extends BeregningsresultatPeriode {
  id: string;
  openForm?: boolean;
}

export interface SlettetPeriode extends BeregningsresultatPeriodeDto {
  begrunnelse: string;
  updated?: boolean;
}

export type TilkjentYtelseFormState = {
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  perioder: BeriketBeregningsresultatPeriode[];
  slettedePerioder?: SlettetPeriode[];
  nyPeriodeForm?: NyPeriodeFormState;
  nyArbeidsgiverForm?: NyArbeidsgiverFormState;
};

export type NyPeriodeFormAndeler = Omit<BeregningsresultatPeriodeAndel, 'inntektskategori'> & {
  inntektskategori: string;
};

export type NyPeriodeFormState = {
  fom: string;
  tom: string;
  andeler?: NyPeriodeFormAndeler[];
};

export type NyArbeidsgiverFormState = ArbeidsgiverOpplysninger & {
  orgNr: string;
};
