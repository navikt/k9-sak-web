import { SimpleEndpoints, SimpleLink } from '@k9-sak-web/types';

export function findEndpointsForMicrofrontend(
  links: SimpleLink[],
  desiredRels: { rel: string; desiredName: string }[],
): SimpleEndpoints {
  const endpoints = {};
  desiredRels.forEach(desiredRel => {
    const matchingLink = links.find(({ rel }) => rel === desiredRel.rel);
    if (matchingLink) {
      endpoints[desiredRel.desiredName] = matchingLink.href;
    }
  });
  return endpoints;
}

export default findEndpointsForMicrofrontend;
