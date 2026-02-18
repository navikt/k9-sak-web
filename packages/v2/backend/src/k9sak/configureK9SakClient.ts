import { K9SakApiError } from './errorhandling/K9SakApiError.js';
import { getNavCallidFromHeader } from '../shared/instrumentation/navCallid.js';
import { client } from '@navikt/k9-sak-typescript-client/client';
import type { AuthFixApi } from '../shared/auth/AuthFixApi.js';
import { ClientConfigHelper } from '../shared/config/ClientConfigHelper.js';

const baseUrl = '/k9/sak';

/**
 * configureK9SakClient må kalles en gang (globalt) før man (implisitt) bruker klienten ved å kalle generert funksjon fra "@navikt/k9-sak-typescript-client/sdk".
 * Slik at baseUrl, etc blir satt før første kall gjennom klient skjer.
 */
export const configureK9SakClient = (authFixer: AuthFixApi) => {
  const sharedConfigurator = new ClientConfigHelper(authFixer);
  client.setConfig({
    baseUrl,
    querySerializer: sharedConfigurator.querySerializerConfig,
  });

  // Add nav call id and json serializer option headers to all requests
  client.interceptors.request.use(sharedConfigurator.requestInterceptor);

  const responseInterceptor = sharedConfigurator.responseInterceptor;
  client.interceptors.response.use(async (response, request, resolvedRequestOptions) => {
    return responseInterceptor(response, request, resolvedRequestOptions.fetch ?? fetch);
  });

  // Turn all response errors into ApiError instances
  client.interceptors.error.use((error, response, request) => {
    if (error !== null && (typeof error === 'string' || typeof error === 'object')) {
      return new K9SakApiError(request, response, error, getNavCallidFromHeader(request));
    } else {
      return new K9SakApiError(request, response, JSON.stringify(error), getNavCallidFromHeader(request));
    }
  });
};
