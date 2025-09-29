import type { Path } from 'react-router';

export const isUngWeb = () => window.location.pathname.includes('/ung/web');

type QueryParams = {
  punkt?: string;
  fakta?: string;
  tab?: string;
  stotte?: string;
  risiko?: boolean;
};

export const pathWithQueryParams = <T extends Partial<Path>>(path: T, queryParams: QueryParams): T => {
  const search = new URLSearchParams(path.search);
  for (const [key, val] of Object.entries(queryParams)) {
    search.set(key, `${val}`);
  }
  return {
    ...path,
    search: search.toString(),
  };
};

const paramSegmentPattern = /^:(\w+)(\(.+\))?(\?)?$/;

export const resolveParam = (params: { [key: string]: string | number }) => (segment: string) => {
  const [paramName, paramPattern, optional] = paramSegmentPattern.exec(segment)?.slice(1, 4) ?? [];
  if (paramName != null) {
    const paramMatch = new RegExp(paramPattern ?? '(.+)').exec(`${params[paramName]}`);
    const paramValue = paramMatch != null && paramMatch[1] != null ? paramMatch[1].replace(/^undefined$/, '') : '';
    return paramValue || (optional ? '' : segment);
  }
  return segment;
};

export const buildPath = (path: string, params: { [key: string]: string | number } = {}) => {
  const maybeLeadingSlash = path.startsWith('/') ? '/' : '';
  const maybeTrailingSlash = path.endsWith('/') ? '/' : '';
  const pathWithParams = path
    .split('/') // Split on delimiter '/'
    .map(resolveParam(params))
    .filter(segment => segment !== '')
    .join('/')
    .trim();
  return `${maybeLeadingSlash}${pathWithParams}${maybeTrailingSlash}`;
};
