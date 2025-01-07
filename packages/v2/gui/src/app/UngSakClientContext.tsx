import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { jsonSerializerOption } from '@k9-sak-web/backend/shared/jsonSerializerOption.js';
import { UngSakHttpRequest } from '@k9-sak-web/backend/ungsak/errorhandling/UngSakHttpRequest.js';
import type { ApiRequestOptions } from '@k9-sak-web/backend/ungsak/generated';
import { UngSakClient } from '@k9-sak-web/backend/ungsak/generated';
import { createContext } from 'react';

// Current client generator hardcode accept: application/json into every request, which causes requests for binary content
// (pdf) to be denied by the server. To work around this until client generator works properly, we override the accept
// header manually for the few requests that don't serve json.
// TODO Remove when generated typescript client can set correct Accept header by itself.
const acceptHeaderOverrideWorkaround = (options: ApiRequestOptions<Record<string, string>>): Record<string, string> =>
  options.url === '/formidling/vedtaksbrev/forhaandsvis' ? { Accept: 'application/pdf' } : {};

const headerResolver = async (options: ApiRequestOptions<Record<string, string>>): Promise<Record<string, string>> => {
  const { headerName, headerValue } = generateNavCallidHeader();
  const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;
  return {
    ...options.headers,
    ...acceptHeaderOverrideWorkaround(options),
    [headerName]: headerValue, // Legg til nav call id header
    [xJsonSerializerOptionHeader]: xJsonSerializerOptionValue, // Legg til X-Json-Serializer-Option header
  };
};

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 */
export const UngSakClientContext = createContext(
  new UngSakClient(
    {
      BASE: '/ung/sak/api',
      HEADERS: headerResolver,
    },
    UngSakHttpRequest,
  ),
);
