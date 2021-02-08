import { Personpplysninger, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

function lagVisningsnavnForKlagepart(
  partId: string,
  personopplysninger?: Personpplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[partId] &&
    arbeidsgiverOpplysningerPerId[partId].navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[partId].navn} (${partId})`;
  }

  if (personopplysninger && personopplysninger.aktoerId === partId) {
    return `${personopplysninger.navn} (${partId})`;
  }

  return partId;
}

export default lagVisningsnavnForKlagepart;
