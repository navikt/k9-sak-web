import { K9TilbakeApiError } from './errorhandling/K9TilbakeApiError.js';
import { getNavCallidFromHeader } from '../shared/instrumentation/navCallid.js';
import { client } from '@navikt/k9-tilbake-typescript-client/client';
import type { AuthFixApi } from '../shared/auth/AuthFixApi.js';
import { ClientConfigHelper } from '../shared/config/ClientConfigHelper.js';
import { isAbortedFetchError } from '../shared/isAbortedFetchError.js';
import { defaultQuerySerializer } from '../shared/config/querySerializer.js';

const baseUrl = '/k9/tilbake';

/**
 * configureK9TilbakeClient må kalles en gang (globalt) før man (implisitt) bruker klienten ved å kalle generert funksjon fra "@navikt/k9-tilbake-typescript-client/sdk".
 * Slik at baseUrl, etc blir satt før første kall gjennom klient skjer.
 */
export const configureK9TilbakeClient = (authFixer: AuthFixApi) => {
  const sharedConfigurator = new ClientConfigHelper(authFixer);
  client.setConfig({
    baseUrl,
    querySerializer: defaultQuerySerializer,
  });

  client.interceptors.request.use(sharedConfigurator.requestInterceptor);

  const responseInterceptor = sharedConfigurator.responseInterceptor;
  client.interceptors.response.use(async (response, request, resolvedRequestOptions) => {
    return responseInterceptor(response, request, resolvedRequestOptions.fetch ?? fetch);
  });

  // response og request kan være undefined, f.eks. når fetch kaster feil før respons er mottatt.
  client.interceptors.error.use((error, response: Response | undefined, request: Request | undefined) => {
    // Uten request kan det ikke lages ApiError, så original feil returneres.
    if (request === undefined) {
      return error;
    }
    // Avbrutte kall skal ikke pakkes inn, slik at kallende kode kan gjenkjenne dem med isAbortedFetchError.
    if (isAbortedFetchError(error)) {
      return error;
    }
    const navCallid = getNavCallidFromHeader(request);
    const options = error instanceof Error ? { cause: error } : undefined;
    if (error !== null && (typeof error === 'string' || typeof error === 'object')) {
      return new K9TilbakeApiError(request, response, error, navCallid, options);
    } else {
      return new K9TilbakeApiError(request, response, JSON.stringify(error), navCallid, options);
    }
  });
};
