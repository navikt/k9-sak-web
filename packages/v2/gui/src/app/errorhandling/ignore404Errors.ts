import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

/**
 * Brukast som verdi for `throwOnError`-opsjonen i useQuery. Returnerer `false` for 404-feil, slik at
 * dei vert svelgde i staden for å bli kasta vidare til næraste ErrorBoundary. Alle andre feil vert kasta som vanleg.
 *
 * Handterer både AxiosError (legacy, status 404) og ExtendedApiError (isNotFound === true).
 *
 * k9-sak returnerer 404 feil viss TomtResultatException blir kasta. Viss klient gjere kall til endepunkt/adresse som ikkje
 * finnast (eigentleg 404 feil), returnerast pr no 500 feil. Så den type feil blir ikkje ignorert av denne funksjon.
 *
 * Denne blir lagt til på useQuery kall som tidlegare ignorerte alle feil ved overgang til ny feilhandtering der ein
 * eksplisitt må ignorere feil som ikkje skal rapporterast, for å unngå for mange feilrapporter i overgang. Det er ikkje
 * sikkert alle stader den er lagt til faktisk treng denne.
 *
 * Ved omskriving/ny kode bør ein heller skrive koden slik at den ikkje feiler med 404 feil ved normale situasjoner.
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
