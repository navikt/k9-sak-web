import type { ArbeidsgiverOpplysningerDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOpplysningerDto.ts';
import type {
  ArbeidsgiverOpplysninger as FPArbeidsgiverOpplysingerDto,
  ArbeidsgiverOpplysningerPerId as FPArbeidsgiverOpplysningerPerId,
} from '@navikt/ft-types';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.ts';

/**
 * ArbeidsgiverOpplysningerDto er forskjellig definert i K9-sak (og ung-sak) i forhold til FP-sak. ft-frontend komponenter er bygd etter FP-sak sin definisjon.
 * Må derfor mappe om her for at det skal bli korrekt.
 * I K9-sak har privatperson personIdentifikator og fødselsdato satt. personIdentifikator er fødselsnr for arbeidsgiver som er person.
 * Mapper ikke personIdentifikator videre siden den ikke er i bruk.
 */
export const mapArbeidsgiverOpplysningerDtoTilFPDto = (
  arbeidsgiverOpplysninger: ArbeidsgiverOpplysningerDto,
): FPArbeidsgiverOpplysingerDto => {
  if (arbeidsgiverOpplysninger.identifikator == null) {
    throw new Error(`Arbeidsgiveropplysninger uten identifikator kan ikke mappes)`);
  }
  if (arbeidsgiverOpplysninger.navn == null) {
    throw new Error(`Arbeidsgiveropplysninger uten navn kan ikke mappes)`);
  }
  if (arbeidsgiverOpplysninger.fødselsdato != null && arbeidsgiverOpplysninger.fødselsdato.length > 0) {
    return {
      erPrivatPerson: true,
      identifikator: arbeidsgiverOpplysninger.identifikator,
      navn: arbeidsgiverOpplysninger.navn,
      fødselsdato: arbeidsgiverOpplysninger.fødselsdato,
    };
  } else {
    return {
      erPrivatPerson: false,
      identifikator: arbeidsgiverOpplysninger.identifikator,
      navn: arbeidsgiverOpplysninger.navn,
    };
  }
};

export const mapArbeidsgiverOpplysningerPerIdTilFP = (
  arbeidsgiverOversikt: ArbeidsgiverOversiktDto | undefined,
): FPArbeidsgiverOpplysningerPerId => {
  const mapped: FPArbeidsgiverOpplysningerPerId = {};
  if (arbeidsgiverOversikt?.arbeidsgivere != null) {
    for (const [id, oppl] of Object.entries(arbeidsgiverOversikt.arbeidsgivere)) {
      mapped[id] = mapArbeidsgiverOpplysningerDtoTilFPDto(oppl);
    }
  }
  return mapped;
};
