import Kodeverk from './kodeverkTsType';

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
  fastsattVarigEndring?: boolean;
  skjæringstidspunkt: string;
}>;

export type TotrinnskontrollAksjonspunkt = Readonly<{
  aksjonspunktKode: string;
  opptjeningAktiviteter?: OpptjeningAktiviteter[];
  besluttersBegrunnelse?: string;
  totrinnskontrollGodkjent?: boolean;
  vurderPaNyttArsaker?: Kodeverk[];
  arbeidsforholdDtos?: TotrinnskontrollArbeidsforhold[];
  beregningDtoer?: TotrinnsBeregningDto[];
}>;

export default TotrinnskontrollAksjonspunkt;
