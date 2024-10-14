import type { ArbeidsforholdIdDto } from '@k9-sak-web/backend/k9sak/generated';

export type ArbeidsgiverOpplysninger = Readonly<{
  erPrivatPerson?: boolean;
  referanse?: string;
  identifikator: string;
  personIdentifikator?: string;
  navn: string;
  fødselsdato?: string;
  arbeidsforholdreferanser: ArbeidsforholdIdDto[];
}>;

export type ArbeidsgiverOpplysningerPerId = Record<string, ArbeidsgiverOpplysninger>;
