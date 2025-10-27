type LocationPart = Pick<typeof window.location, 'pathname' | 'search' | 'origin'>;

// Oauth 2 redirect flow propagerer verdien av parameter med dette namn, slik at opprinneleg request kan gjerast på nytt når autentisering er fullført.
const redirectToQueryArgumentName = 'redirectTo';

/**
 * Utleder url som må opnast for å (re-)autentisere bruker for kommunikasjon med server basert på location header returnert i 401 respons frå server.
 * @param responseLocationHeader Verdi frå Location header i respons frå server.
 * @param currentLocation Verdi av window.location i nettlesaren. Eksponert mtp testing.
 */
export const resolveLoginURL = (
  responseLocationHeader: string | null,
  currentLocation: LocationPart = window.location,
): URL | null => {
  if (responseLocationHeader == null) {
    return responseLocationHeader;
  }
  let loginURL = URL.parse(responseLocationHeader);
  if (loginURL == null) {
    // responseLocationHeader mangler sannsynlegvis base, prøv igjen med currentLocation som base
    loginURL = URL.parse(responseLocationHeader, currentLocation.origin);
  }
  return loginURL;
};

export const withRedirectTo = (loginURL: URL | null, to: string) => {
  if (loginURL != null) {
    const withRedirectTo = new URL(loginURL); // Avoid mutating parameter
    if (!withRedirectTo.searchParams.has(redirectToQueryArgumentName)) {
      withRedirectTo.searchParams.set(redirectToQueryArgumentName, to);
    }
    return withRedirectTo;
  }
  return null;
};

export const withRedirectToCurrentLocation = (
  loginURL: URL | null,
  currentLocation: LocationPart = window.location,
): URL | null => {
  return withRedirectTo(loginURL, currentLocation.pathname + currentLocation.search);
};
