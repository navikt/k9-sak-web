import type { K9SakClient, UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export default class UngBeregningBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getSatser(behandlingUuid: string): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return this.#k9sak.ung.getUngdomsytelseInnvilgetSats(behandlingUuid);
  }
}
