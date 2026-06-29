import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

/**
 * Brukast som verdi for `throwOnError`-opsjonen i useQuery. Returnerer `false` for 404-feil, slik at
 * dei vert svelgde i staden for å bli kasta vidare til næraste ErrorBoundary. Alle andre feil vert kasta som vanleg.
 *
 * Handterer både AxiosError (legacy, status 404) og ExtendedApiError (isNotFound === true).
 */
export const ignore404Errors = (error: Error): boolean => {
  if (error instanceof AxiosError && error.response?.status === 404) {
    return false;
  }
  const apiError = ExtendedApiError.findInError(error);
  if (apiError?.isNotFound) {
    return false;
  }
  return true;
};
