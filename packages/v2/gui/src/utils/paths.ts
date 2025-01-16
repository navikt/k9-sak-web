export const fagsakPath = '/fagsak/:saksnummer/';

const paramSegmentPattern = /^:(\w+)(\(.+\))?(\?)?$/;

const resolveParam = (params: { [key: string]: string | number }) => (segment: string) => {
  if (!paramSegmentPattern.test(segment)) {
    return segment;
  }
  const match = paramSegmentPattern.exec(segment);
  const [paramName, paramPattern, optional] = match ? match.slice(1, 4) : [];
  const paramMatch = paramName && new RegExp(paramPattern || '(.+)').exec(`${params[paramName]}`);
  const paramValue = paramMatch && paramMatch[1] ? paramMatch[1].replace(/^undefined$/, '') : '';
  return paramValue || (optional ? '' : segment);
};

export const buildPath = (path: string, params: { [key: string]: string | number } = {}) =>
  path
    .replace(/^\//, ' /') // Add whitespace before leading slash to keep it from being consumed by split
    .replace(/\/$/, '/ ') // Add whitespace after trailing slash to keep it from being consumed by split
    .split('/') // Split on delimiter '/'
    .map(resolveParam(params))
    .filter(segment => segment !== '')
    .join('/')
    .trim();
export const pathToFagsak = (saksnummer: string): string => buildPath(fagsakPath, { saksnummer });
