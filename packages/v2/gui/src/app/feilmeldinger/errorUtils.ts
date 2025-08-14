import type { k9_sak_kontrakt_FeilDto as FeilDto } from '@k9-sak-web/backend/k9sak/generated';

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
