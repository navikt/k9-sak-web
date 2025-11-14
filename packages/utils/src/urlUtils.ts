import { buildPath as v2BuildPath } from '@k9-sak-web/gui/utils/urlUtils.js';

/**
 * @deprecated Bruk URLSearchParams istaden
 */
export const parseQueryString = (queryString: string = '') =>
  queryString
    .replace(/^\?/, '') // Remove leading question mark
    .replace(/\+/g, '%20') // Replace plus signs with URL-encoded spaces
    .split(/&/) // Split on delimiter '&'
    .map(query => query.split(/=/))
    .map(([key, value]) => ({ [key]: decodeURIComponent(value) })) // URL-decode value
    .reduce((a, b) => ({ ...a, ...b }), {});

/**
 * @deprecated Bruk URLSearchParams istaden
 */
export const formatQueryString = (queryParams: { [key: string]: string | boolean } = {}) =>
  `?${
    // Add leading question mark
    Object.entries(queryParams)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => value !== undefined && value !== null && value !== '') // Filter out empty/null/undef values
      .map(([key, value]) => [key, encodeURIComponent(value as string)]) // URL-encode value
      .map(([key, encodedValue]) => `${key}=${encodedValue}`)
      .join('&') // Join with delimiter '&'
      .replace(/%20/g, '+') // Replace URL-encoded spaces with plus
  }`;

export const buildPath = v2BuildPath;
