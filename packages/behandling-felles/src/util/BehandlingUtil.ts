import type { Behandling } from '@k9-sak-web/types';

class BehandlingUtil {
  behandling: Behandling;

  constructor(behandling: Behandling) {
    this.behandling = behandling;
  }

  getEndpointHrefByRel(desiredRel: string) {
    const matchingLink = this.behandling.links.find(({ rel }) => rel === desiredRel);
    if (matchingLink) {
      return matchingLink.href;
    }
    return null;
  }
}

export default BehandlingUtil;
