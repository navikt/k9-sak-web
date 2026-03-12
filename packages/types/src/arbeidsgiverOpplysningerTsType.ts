import ArbeidsforholdId from "./arbeidsforholdIdTsType";

export type ArbeidsgiverOpplysninger = Readonly<{
    erPrivatPerson: boolean;
    referanse?: string;
    identifikator: string;
    personIdentifikator?: string;
    navn: string;
    fødselsdato?: string;
    arbeidsforholdreferanser: ArbeidsforholdId[];
}>;

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;

export type ArbeidsgiverOpplysningerWrapper = {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
};

export default ArbeidsgiverOpplysningerPerId;
