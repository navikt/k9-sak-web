export type ArbeidsgiverOpplysninger = Readonly<{
  erPrivatPerson?: boolean;
  referanse?: string;
  identifikator: string;
  personIdentifikator?: string;
  navn: string;
  fødselsdato?: string;
}>;

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;
