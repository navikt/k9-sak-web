import { K9SakApiError } from './errorhandling/K9SakApiError.js';
import { generateNavCallidHeader, getNavCallidFromHeader } from '../shared/instrumentation/navCallid.js';
import { jsonSerializerOption } from '../shared/jsonSerializerOption.js';
import { client } from '@navikt/k9-sak-typescript-client/client';

const baseUrl = '/k9/sak';

const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;

/**
 * configureK9SakClient må kalles en gang (globalt) før man (implisitt) bruker klienten ved å kalle generert funksjon fra "@navikt/k9-sak-typescript-client/sdk".
 * Slik at baseUrl, etc blir satt før første kall gjennom klient skjer.
 */
export const configureK9SakClient = () => {
  client.setConfig({
    baseUrl,
    // querySerializer settast slik fordi nokre query parametre (feks SaksnummerDto) er definert som klasse med json serialisering satt til object.
    // openapi spesifikasjon seier då at det skal sendast inn objekt som query parameter, og dette blir som standard serialisert til ?saksnummer[saksnummer]=verdi,
    // som feiler på serveren. Ved å sette querySerializer slik blir url istaden ?saksnummer=verdi, som er det serveren forventar. Dette stemmer og med det
    // swagger-ui gjere i disse tilfella.
    querySerializer: {
      object: {
        explode: true,
        style: 'form',
      },
      array: {
        explode: true,
        style: 'form',
      },
    },
  });

  // Add nav call id and json serializer option headers to all requests
  client.interceptors.request.use(request => {
    const { headerName, headerValue } = generateNavCallidHeader();
    request.headers.set(headerName, headerValue);
    request.headers.set(xJsonSerializerOptionHeader, xJsonSerializerOptionValue);
    return request;
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
