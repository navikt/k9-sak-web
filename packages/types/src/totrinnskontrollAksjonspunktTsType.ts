import Kodeverk from './kodeverkTsType';

enum TypeEndring {
  AVKLART = 'AVKLART',
  ENDRET = 'ENDRET',
  SLETTET = 'SLETTET',
  LAGT_TIL = 'LAGT_TIL',
}

export type TotrinnskontrollArbeidsforhold = Readonly<{
  navn: string;
  organisasjonsnummer: string;
  arbeidsforholdId: string;
  arbeidsforholdHandlingType: Kodeverk;
  brukPermisjon: boolean;
}>;

export type OpptjeningAktiviteter = Readonly<{
  aktivitetType: string;
  erEndring: boolean;
  arbeidsgiverNavn: string;
  orgnr: string;
  godkjent: boolean;
  privatpersonFødselsdato?: string;
}>;

export type TotrinnsBeregningDto = Readonly<{
  faktaOmBeregningTilfeller: Kodeverk[];
  fastsattVarigEndringNaering: boolean;
  skjæringstidspunkt: string;
}>;

export type TotrinnskontrollAksjonspunkt = Readonly<{
  aksjonspunktKode: string;
  opptjeningAktiviteter?: OpptjeningAktiviteter[];
  besluttersBegrunnelse?: string;
  totrinnskontrollGodkjent?: boolean;
  vurderPaNyttArsaker?: Kodeverk[];
  uttakPerioder?: {
    fom: string;
    tom: string;
    typeEndring: TypeEndring;
    erSlettet: boolean;
    erAvklart: boolean;
    erLagtTil: boolean;
    erEndret: boolean;
  }[];
  arbeidsforholdDtos?: TotrinnskontrollArbeidsforhold[];
  beregningDtoer?: TotrinnsBeregningDto[];
  beregningDto?: TotrinnsBeregningDto;
}>;

export default TotrinnskontrollAksjonspunkt;
