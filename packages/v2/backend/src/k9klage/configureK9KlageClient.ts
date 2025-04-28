import { K9KlageApiError } from './errorhandling/K9KlageApiError.js';
import { generateNavCallidHeader, getNavCallidFromHeader } from '../shared/instrumentation/navCallid.js';
import { jsonSerializerOption } from '../shared/jsonSerializerOption.js';
import { clientVersion } from './generated/metadata.js';
import { client } from '@navikt/k9-klage-typescript-client/client';

// generert klientversjon over 1.0 har /api prefix satt på paths generert inn i klientkalla, som er det korrekte.
// for versjoner under må vi legge /api til på baseUrl for at kalla skal fungere, sidan openapi spesifikasjon generert
// til fil mangla /api på paths då.
// Kan fjernast når vi veit vi er komt over på version >= 1.1 av klient.
const baseUrl = Number(clientVersion.major) > 1 || Number(clientVersion.minor) > 0 ? '/k9/sak' : '/k9/sak/api';

const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;

/**
 * configureK9KlageClient må kalles en gang (globalt) før man (implisitt) bruker klienten ved å kalle generert funksjon fra "@navikt/k9-klage-typescript-client/sdk".
 * Slik at baseUrl, etc blir satt før første kall gjennom klient skjer.
 */
export const configureK9KlageClient = () => {
  client.setConfig({
    baseUrl,
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
      return new K9KlageApiError(request, response, error, getNavCallidFromHeader(request));
    } else {
      return new K9KlageApiError(request, response, JSON.stringify(error), getNavCallidFromHeader(request));
    }
  });
};
