import type { OpprettLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/tjenester/opplæringspenger/OpprettLangvarigSykdomsVurderingData.js';
import {
  getBrevMottakerinfoEreg,
  hentAlleInstitusjoner,
  hentLangvarigSykVurderinger,
  hentVurdertInstitusjon,
  hentVurdertLangvarigSykdom,
  hentVurdertOpplæring,
  hentVurdertReisetid,
  opprettLangvarigSykdomsVurdering,
  getVilkår,
} from '@k9-sak-web/backend/k9sak/sdk.js';

export default class SykdomOgOpplæringBackendClient {
  async getVilkår(behandlingUuid: string) {
    return (await getVilkår({ query: { behandlingUuid } })).data;
  }

  async opprettSykdomsvurdering(payload: OpprettLangvarigSykdomsVurderingData['body']) {
    return (await opprettLangvarigSykdomsVurdering({ body: payload })).data;
  }

  async hentLangvarigSykVurderingerFagsak(behandlingUuid: string) {
    return (await hentLangvarigSykVurderinger({ query: { behandlingUuid } })).data;
  }

  async hentVurdertLangvarigSykdom(behandlingUuid: string) {
    return (await hentVurdertLangvarigSykdom({ query: { behandlingUuid } })).data;
  }

  // Institusjon
  async getInstitusjonInfo(behandlingUuid: string) {
    return (await hentVurdertInstitusjon({ query: { behandlingUuid } })).data;
  }

  async hentAlleInstitusjoner() {
    return (await hentAlleInstitusjoner()).data;
  }

  async hentOrganisasjonsnummer(organisasjonsnummer: string) {
    return (await getBrevMottakerinfoEreg({ body: { organisasjonsnr: organisasjonsnummer } })).data;
  }

  // Nødvendig opplæring
  async getVurdertOpplæring(behandlingUuid: string) {
    return (await hentVurdertOpplæring({ query: { behandlingUuid } })).data;
  }

  // Reisetid
  async getVurdertReisetid(behandlingUuid: string) {
    return (await hentVurdertReisetid({ query: { behandlingUuid } })).data;
  }
}
