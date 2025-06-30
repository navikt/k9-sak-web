import { type K9SakClient, type OppdaterLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/generated';
import { type OpprettLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/generated';
export default class SykdomOgOpplæringBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getVilkår(behandlingUuid: string) {
    return this.#k9sak.vilkår.getVilkårV3(behandlingUuid);
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

  async hentVurdertLangvarigSykdom(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentVurdertLangvarigSykdom(behandlingUuid);
  }

  // Institusjon
  async getInstitusjonInfo(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentVurdertInstitusjon(behandlingUuid);
  }

  async hentAlleInstitusjoner() {
    return this.#k9sak.opplæringsinstitusjon.hentAlle();
  }

  // Nødvendig opplæring
  async getVurdertOpplæring(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentVurdertOpplæring(behandlingUuid);
  }

  // Reisetid
  async getVurdertReisetid(behandlingUuid: string) {
    return this.#k9sak.opplæringspenger.hentVurdertReisetid(behandlingUuid);
  }
}
