import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { jsonSerializerOption } from '@k9-sak-web/backend/shared/jsonSerializerOption.js';
import { UngSakHttpRequest } from '@k9-sak-web/backend/ungsak/errorhandling/UngSakHttpRequest.js';
import type { ApiRequestOptions } from '@k9-sak-web/backend/ungsak/generated';
import { UngSakClient } from '@k9-sak-web/backend/ungsak/generated';
import { createContext } from 'react';

const headerResolver = async (options: ApiRequestOptions<Record<string, string>>): Promise<Record<string, string>> => {
  const { headerName, headerValue } = generateNavCallidHeader();
  const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;
  return {
    ...options.headers,
    [headerName]: headerValue, // Legg til nav call id header
    [xJsonSerializerOptionHeader]: xJsonSerializerOptionValue, // Legg til X-Json-Serializer-Option header
  };
};

/**
 * This shall be a top level context providing the UngSakClient instance that will be used for communicating with the backend server.
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
