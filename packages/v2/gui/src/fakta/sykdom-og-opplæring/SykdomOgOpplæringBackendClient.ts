import { type K9SakClient, type OppdaterLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/generated';
import { type InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/components/InstitusjonForm.js';
import { type OpprettLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/generated';
export default class SykdomOgOpplæringBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async hentDiagnosekoder(behandlingUuid: string) {
    return this.#k9sak.sykdom.hentDiagnosekoder(behandlingUuid);
  }

  async opprettSykdomsvurdering(payload: OpprettLangvarigSykdomsVurderingData['requestBody']) {
    return this.#k9sak.opplæringspenger.opprettLangvarigSykdomsVurdering(payload);
  }

  async oppdaterSykdomsvurdering(payload: OppdaterLangvarigSykdomsVurderingData['requestBody']) {
    return this.#k9sak.opplæringspenger.oppdaterLangvarigSykdomsVurdering(payload);
  }

  async hentLangvarigSykVurderingerFagsak(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentLangvarigSykVurderingerFagsak(behandlingUuid);
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
