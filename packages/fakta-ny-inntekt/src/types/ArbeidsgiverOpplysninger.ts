export type ArbeidsgiverOpplysninger = Readonly<{
  erPrivatPerson: boolean;
  referanse?: string;
  identifikator: string;
  navn: string;
  fødselsdato?: string;
}>;

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;

export type ArbeidsgiverOpplysningerWrapper = {
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
};
