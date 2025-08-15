import { ArbeidsgiverOpplysninger, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import {
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeAndelDto as BeregningsresultatPeriodeAndelDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeDto as BeregningsresultatPeriodeDto,
} from '@navikt/k9-sak-typescript-client';

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
