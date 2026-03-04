import { ArbeidsgiverOpplysninger, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import type { BeregningsresultatPeriodeAndelDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatPeriodeAndelDto.js';
import type { BeregningsresultatPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatPeriodeDto.js';

export interface BeriketBeregningsresultatPeriode extends Omit<BeregningsresultatPeriodeDto, 'andeler'> {
  id: string;
  andeler: Array<NyPeriodeFormAndeler & { arbeidsgiverPersonIdent?: string }> | null;
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

export type NyPeriodeFormAndeler = Omit<BeregningsresultatPeriodeAndelDto, 'inntektskategori'> & {
  inntektskategori: string;
  arbeidsgiverPersonIdent?: string;
};

export type NyPeriodeFormState = {
  fom: string;
  tom: string;
  andeler?: NyPeriodeFormAndeler[];
};

export type NyArbeidsgiverFormState = ArbeidsgiverOpplysninger & {
  orgNr: string;
};
