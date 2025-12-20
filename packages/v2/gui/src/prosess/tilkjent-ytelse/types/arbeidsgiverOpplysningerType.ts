export type ArbeidsgiverOpplysninger = Readonly<{
  erPrivatPerson?: boolean;
  referanse?: string;
  identifikator?: string | undefined;
  personIdentifikator?: string;
  navn?: string | undefined;
  fødselsdato?: string;
}>;

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;
