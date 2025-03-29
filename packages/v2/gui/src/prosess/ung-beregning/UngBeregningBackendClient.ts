import type {
  KontrollerInntektDto,
  UngSakClient,
  UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';

export default class UngBeregningBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsakClient: UngSakClient) {
    this.#ungsak = ungsakClient;
  }

  async getSatser(behandlingUuid: string): Promise<UngdomsytelseSatsPeriodeDto[]> {
    return this.#ungsak.ung.getUngdomsytelseInnvilgetSats(behandlingUuid);
  }

  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return this.#ungsak.kontroll.hentKontrollerInntekt(behandlingUuid);
  }
}
