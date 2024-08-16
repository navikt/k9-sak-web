import {
  ArbeidsgiverOpplysninger,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatPeriode,
  BeregningsresultatPeriodeAndel,
} from '@k9-sak-web/types';

export interface BeriketBeregningsresultatPeriode extends BeregningsresultatPeriode {
  id: string;
  openForm?: boolean;
}

export interface SlettetPeriode extends BeriketBeregningsresultatPeriode {
  begrunnelse: string;
  updated?: boolean;
}

export type TilkjentYtelseFormState = {
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  perioder: BeriketBeregningsresultatPeriode[];
  slettedePerioder?: SlettetPeriode[];
};

export type NyPeriodeFormAndeler = Omit<BeregningsresultatPeriodeAndel, 'inntektskategori'> & {
  inntektskategori: string;
};

export type NyPeriodeFormState = {
  fom: null;
  tom: null;
  andeler?: NyPeriodeFormAndeler[];
};

export type NyArbeidsgiverFormState = ArbeidsgiverOpplysninger & {
  orgNr: string;
};
