import type { FeilDto } from '@navikt/k9-sak-typescript-client';

/**
 * Henter feilmelding fra FeilDto.
 * Hvis feltFeil array er tom eller ikke eksisterer, returnerer feilmelding.
 */
export const getFeilmeldingFraFeilDto = (feilDto?: FeilDto | null): string => {
  if (!feilDto) {
    return '';
  }

  if (feilDto?.feltFeil && feilDto.feltFeil.length > 0) {
    const firstFeltFeil = feilDto.feltFeil[0];
    if (firstFeltFeil) {
      return firstFeltFeil.melding;
    }
  }

  return feilDto.feilmelding;
};
