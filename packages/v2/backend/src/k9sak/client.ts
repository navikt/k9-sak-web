import { K9SakClient } from './generated';
import { generateNavCallidHeader } from '../shared/instrumentation/navCallid.js';
import type { ApiRequestOptions } from './generated';
import { K9SakHttpRequest } from './errorhandling/K9SakHttpRequest.js';
import { jsonSerializerOption } from '../shared/jsonSerializerOption.js';
import { clientVersion } from './generated/metadata';

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

let k9sakClient: K9SakClient | null = null;

export const getK9SakClient = () => {
  if (k9sakClient == null) {
    k9sakClient = new K9SakClient(
      {
        BASE: baseUrl,
        HEADERS: headerResolver,
      },
      K9SakHttpRequest,
    );
  }
  return k9sakClient;
};
