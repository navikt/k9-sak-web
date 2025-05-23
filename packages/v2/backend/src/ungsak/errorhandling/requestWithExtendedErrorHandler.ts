import { ApiError, CancelablePromise, type OpenAPIConfig } from '@navikt/ung-sak-typescript-client';
import type { ApiRequestOptions } from '@navikt/ung-sak-typescript-client/core/ApiRequestOptions.js';
import type { ApiResult } from '@navikt/ung-sak-typescript-client/core/ApiResult.js';
import {
  catchErrorCodes,
  getFormData,
  getHeaders,
  getRequestBody,
  getResponseBody,
  getResponseHeader,
  sendRequest,
} from '@navikt/ung-sak-typescript-client/core/request.js';
import { navCallidHeaderName } from '../../shared/instrumentation/navCallid.js';
import { UngSakApiError } from './UngSakApiError.js';

// Kopiert inn frå @navikt/k9-sak-typescript-client/core/request.ts, for å fikse problem med objekt som query param verdier.
// Denne er ein endra versjon som "destrukturerer" objektverdier slik at dei blir ein flat propname=verdi query string.
// Det ser ut til at dette matcher det swagger server gjere i slike tilfeller, istadenfor original oppførsel til generert kodelib.
// Behovet for denne skal forsvinne etter neste hovedoppdatering av generert klient.
const getQueryString = (params: Record<string, unknown>): string => {
  const qs: string[] = [];
  const append = (key: string, value: unknown) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };
  const encodePair = (key: string, value: unknown) => {
    if (value === undefined || value === null) {
      return;
    }
    if (value instanceof Date) {
      append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach(v => encodePair(key, v));
    } else if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        encodePair(k, v); // Rekursivt encode alle props = verdi for objekt
      }
    } else {
      append(key, value);
    }
  };
  Object.entries(params).forEach(([key, value]) => encodePair(key, value));
  return qs.length ? `?${qs.join('&')}` : '';
};

// Kopiert inn frå @navikt/k9-sak-typescript-client/core/request.js, sidan den ikkje blir eksportert der
const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url
    .replace('{api-version}', config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      // eslint-disable-next-line no-prototype-builtins
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  const url = config.BASE + path;
  return options.query ? url + getQueryString(options.query) : url;
};

/**
 * Kopiert inn og tilpassa frå @navikt/k9-sak-typescript-client/core/request.js, for å få med sporingsinfo i feil som
 * blir kasta når request blir utført.
 *
 * Ein ny klient pakke er på gang i @hey-api/openapi-ts. Når den er klar kan ein sannsynlegvis fjerne denne
 * spesialtilpassing og oppnå det samme med å bruke ny klient derifrå.
 *
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const requestWithExtendedErrorHandler = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions<T>,
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options);

      if (!onCancel.isCancelled) {
        try {
          let response = await sendRequest(config, options, url, body, formData, headers, onCancel);

          for (const fn of config.interceptors.response._fns) {
            response = await fn(response);
          }

          const responseBody = await getResponseBody(response);
          const responseHeader = getResponseHeader(response, options.responseHeader);

          let transformedBody = responseBody;
          if (options.responseTransformer && response.ok) {
            transformedBody = await options.responseTransformer(responseBody);
          }

          const result: ApiResult = {
            url,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            body: responseHeader ?? transformedBody,
          };

          catchErrorCodes(options, result);

          resolve(result.body);
        } catch (e) {
          // Spesialtilpassing for å få med NavCallid i rapportert feil.
          if (e instanceof ApiError) {
            const navCallid = headers.get(navCallidHeaderName);
            throw new UngSakApiError(e, navCallid);
          } else {
            throw e;
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
