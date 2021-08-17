import { ArbeidsgiverOpplysningerPerId, FagsakPerson} from '@k9-sak-web/types';

function lagVisningsnavnForKlagepart(
  partId: string,
  fagsakPerson?: FagsakPerson,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[partId] &&
    arbeidsgiverOpplysningerPerId[partId].navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[partId].navn} (${partId})`;
  }

  if (fagsakPerson && fagsakPerson.aktørId === partId) {
    return `${fagsakPerson.navn} (${fagsakPerson.personnummer || partId})`;
  }

  return partId;
}

export default lagVisningsnavnForKlagepart;
