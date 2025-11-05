import type { k9_klage_kontrakt_behandling_FagsakDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

function lagVisningsnavnForKlagepart(
  partId: string,
  fagsakPerson?: k9_klage_kontrakt_behandling_FagsakDto['person'],
  arbeidsgiverOpplysningerPerId?: ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'],
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
