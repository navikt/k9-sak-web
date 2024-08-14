import {
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

export type NyPeriodeFormState = {
  fom: null;
  tom: null;
  andeler?: BeregningsresultatPeriodeAndel[];
};

export type NyArbeidsgiverFormState = {
  navn: string;
  orgNr: string;
};
