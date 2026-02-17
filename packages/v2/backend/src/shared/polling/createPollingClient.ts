/**
 * Funksjon som utfører GET-kall under polling og returnerer parset respons-body.
 * Bør gå gjennom samme interceptor-oppsett (auth, headers) som resten av klient-kallene.
 */
export type PollingClient = (url: string, signal?: AbortSignal) => Promise<unknown>;

/**
 * Minimal interface for hey-api-genererte klienter som brukes til polling.
 * Alle backend-klientene (k9sak, k9klage, k9tilbake, ungsak, ungtilbake)
 * implementerer dette via createClient().
 */
interface HeyApiClient {
  get: (options: {
    url: string;
    baseUrl: string;
    signal?: AbortSignal;
    throwOnError: true;
  }) => Promise<{ data: unknown }>;
}

/**
 * Oppretter en PollingClient som bruker en hey-api-generert klient.
 * Kallet går gjennom klientens interceptor-oppsett (nav-call-id, json-serializer,
 * Accept-header, auth-retry ved 401, error-mapping).
 *
 * @param apiClient - Den konfigurerte hey-api-klienten for aktuell backend
 *
 * @example
 * ```ts
 * import { client } from '@navikt/k9-sak-typescript-client/client';
 * export const pollingClient = createPollingClient(client);
 * ```
 */
export const createPollingClient = (apiClient: HeyApiClient): PollingClient => {
  return async (url: string, signal?: AbortSignal): Promise<unknown> => {
    // Location-headeren fra backend kan være en absolutt URL (f.eks. http://localhost:9000/k9/sak/api/...)
    // eller en relativ path (/k9/sak/api/...). hey-api-klienten forventer en path, ikke en full URL,
    // så vi stripper origin dersom det er en absolutt URL for å unngå dobling.
    let path = url;
    try {
      const parsed = new URL(url);
      path = parsed.pathname + parsed.search;
    } catch {
      // Ikke en absolutt URL — bruk som den er
    }

    const result = await apiClient.get({
      url: path,
      baseUrl: '', // path-en inneholder allerede base-path (f.eks. /k9/sak/api/...)
      signal,
      throwOnError: true,
    });
    return result.data;
  };
};
