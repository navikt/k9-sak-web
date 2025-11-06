import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';

function lagVisningsnavnForKlagepart(
  partId: string,
  fagsakPerson?: FagsakDto['person'],
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOversiktDto['arbeidsgivere'],
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
