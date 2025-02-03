import { createContext } from 'react';
import { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import type { ApiRequestOptions } from '@k9-sak-web/backend/k9sak/generated';
import { K9SakHttpRequest } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakHttpRequest.js';
import { jsonSerializerOption } from '@k9-sak-web/backend/shared/jsonSerializerOption.js';
import { clientVersion } from '@k9-sak-web/backend/k9sak/generated/metadata';

const headerResolver = async (options: ApiRequestOptions<Record<string, string>>): Promise<Record<string, string>> => {
  const { headerName, headerValue } = generateNavCallidHeader();
  const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;
  return {
    ...options.headers,
    [headerName]: headerValue, // Legg til nav call id header
    [xJsonSerializerOptionHeader]: xJsonSerializerOptionValue, // Legg til X-Json-Serializer-Option header
  };
};

// generert klientversjon over 1.0 har /api prefix satt på paths generert inn i klientkalla, som er det korrekte.
// for versjoner under må vi legge /api til på baseUrl for at kalla skal fungere, sidan openapi spesifikasjon generert
// til fil mangla /api på paths då.
// Kan fjernast når vi veit vi er komt over på version >= 2.0 av klient.
const baseUrl = Number(clientVersion.major) > 1 ? '/k9/sak' : '/k9/sak/api';

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 */
export const K9SakClientContext = createContext(
  new K9SakClient(
    {
      BASE: baseUrl,
      HEADERS: headerResolver,
    },
    K9SakHttpRequest,
  ),
);
