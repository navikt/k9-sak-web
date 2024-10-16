import type { Inntektskategori } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import type { AktivitetStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AktivitetStatus.js';
import type { ArbeidsgiverDto } from '@navikt/k9-sak-typescript-client';
import type { BeregningsresultatPeriodeDto } from '../../types/BeregningsresultatPeriodeDto';
import type { ArbeidsgiverOpplysninger, ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType';

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

export type NyPeriodeFormAndeler = {
  aktivitetStatus?: AktivitetStatusType;
  arbeidsgiver?: ArbeidsgiverDto & { arbeidsgiverOrgnr?: string; arbeidsgiverPersonIdent?: string };
  arbeidsgiverOrgnr: string;
  arbeidsgiverPersonIdent?: string;
  eksternArbeidsforholdId: string;
  inntektskategori: Inntektskategori;
  refusjon: number;
  tilSoker: number;
  utbetalingsgrad: number;
};

export type NyPeriodeFormState = {
  fom: string;
  tom: string;
  andeler: NyPeriodeFormAndeler[];
};

export type NyArbeidsgiverFormState = ArbeidsgiverOpplysninger & {
  orgNr: string;
};
