import { type K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import { type InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/components/institusjonDetails/InstitusjonForm.js';

export default class SykdomOgOpplæringBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getSykdomInfo(behandlingUuid: string) {
    return this.#k9sak.sykdom.hentSykdomsoversiktForLangvarigSykdom(behandlingUuid);
  }

  async getInstitusjonInfo(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentVurdertInstitusjon(behandlingUuid);
  }

  async submitAksjonspunkt(payload: any) {
    return this.#k9sak.aksjonspunkt.bekreft(payload);
  }

  async submitInstitusjonVurdering(payload: InstitusjonAksjonspunktPayload, behandlingUuid: string) {
    return this.submitAksjonspunkt({
      ...payload,
      behandlingUuid,
    });
  }

  async submitSykdomVurdering(payload: any, behandlingUuid: string) {
    return this.submitAksjonspunkt({
      ...payload,
      behandlingUuid,
    });
  }

  async submitOpplæringVurdering(payload: any, behandlingUuid: string) {
    return this.submitAksjonspunkt({
      ...payload,
      behandlingUuid,
    });
  }
}
