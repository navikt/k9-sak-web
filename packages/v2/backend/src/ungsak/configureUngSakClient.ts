import { client } from '@navikt/ung-sak-typescript-client/client';
import type { AuthFixApi } from '../shared/auth/AuthFixApi.js';
import { ClientConfigHelper } from '../shared/config/ClientConfigHelper.js';
import { getNavCallidFromHeader } from '../shared/instrumentation/navCallid.js';
import { UngSakApiError } from './errorhandling/UngSakApiError.js';

const baseUrl = '/ung/sak';

/**
 * configureUngSakClient må kalles en gang (globalt) før man (implisitt) bruker klienten ved å kalle generert funksjon fra "@navikt/ung-sak-typescript-client/sdk".
 * Slik at baseUrl, etc blir satt før første kall gjennom klient skjer.
 */
export const configureUngSakClient = (authFixer: AuthFixApi) => {
  const sharedConfigurator = new ClientConfigHelper(authFixer);
  client.setConfig({
    baseUrl,
    querySerializer: sharedConfigurator.querySerializerConfig,
  });

  client.interceptors.request.use(sharedConfigurator.requestInterceptor);

  const responseInterceptor = sharedConfigurator.responseInterceptor;
  client.interceptors.response.use(async (response, request, resolvedRequestOptions) => {
    return responseInterceptor(response, request, resolvedRequestOptions.fetch ?? fetch);
  });

  client.interceptors.error.use((error, response, request) => {
    if (error !== null && (typeof error === 'string' || typeof error === 'object')) {
      return new UngSakApiError(request, response, error, getNavCallidFromHeader(request));
    } else {
      return new UngSakApiError(request, response, JSON.stringify(error), getNavCallidFromHeader(request));
    }
  });
};
