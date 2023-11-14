import { SimpleLink } from '@k9-sak-web/types';

export function findEndpointsForMicrofrontend<T>(
  links: SimpleLink[],
  desiredRels: { rel: string; desiredName: string }[],
): T {
  const endpoints = {};
  desiredRels.forEach(desiredRel => {
    const matchingLink = links.find(({ rel }) => rel === desiredRel.rel);
    if (matchingLink) {
      endpoints[desiredRel.desiredName] = matchingLink.href;
    }
  });
  return endpoints as T;
}

export default findEndpointsForMicrofrontend;
