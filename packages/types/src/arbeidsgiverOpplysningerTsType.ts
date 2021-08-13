export type ArbeidsgiverOpplysninger = Readonly<{
  erPrivatPerson: boolean;
  referanse?: string;
  identifikator: string;
  navn: string;
  fødselsdato?: string;
}>;

type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;

export type ArbeidsgiverOpplysningerWrapper = {
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
};

export default ArbeidsgiverOpplysningerPerId;
