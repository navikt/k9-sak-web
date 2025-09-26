import { type OpprettLangvarigSykdomsVurderingData } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  brev_getBrevMottakerinfoEreg,
  opplæringsinstitusjonSaksbehandling_hentAlleV2,
  opplæringspenger_hentLangvarigSykVurderingerFagsak,
  opplæringspenger_hentVurdertInstitusjon,
  opplæringspenger_hentVurdertLangvarigSykdom,
  opplæringspenger_hentVurdertOpplæring,
  opplæringspenger_hentVurdertReisetid,
  opplæringspenger_opprettLangvarigSykdomsVurdering,
  vilkår_getVilkårV3,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class SykdomOgOpplæringBackendClient {
  async getVilkår(behandlingUuid: string) {
    return (await vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }

  async opprettSykdomsvurdering(payload: OpprettLangvarigSykdomsVurderingData['body']) {
    return (await opplæringspenger_opprettLangvarigSykdomsVurdering({ body: payload })).data;
  }

  async hentLangvarigSykVurderingerFagsak(behandlingUuid: string) {
    return (await opplæringspenger_hentLangvarigSykVurderingerFagsak({ query: { behandlingUuid } })).data;
  }

  async hentVurdertLangvarigSykdom(behandlingUuid: string) {
    return (await opplæringspenger_hentVurdertLangvarigSykdom({ query: { behandlingUuid } })).data;
  }

  // Institusjon
  async getInstitusjonInfo(behandlingUuid: string) {
    return (await opplæringspenger_hentVurdertInstitusjon({ query: { behandlingUuid } })).data;
  }

  async hentAlleInstitusjoner() {
    return (await opplæringsinstitusjonSaksbehandling_hentAlleV2()).data;
  }

  async hentOrganisasjonsnummer(organisasjonsnummer: string) {
    return (await brev_getBrevMottakerinfoEreg({ body: { organisasjonsnr: organisasjonsnummer } })).data;
  }

  // Nødvendig opplæring
  async getVurdertOpplæring(behandlingUuid: string) {
    return (await opplæringspenger_hentVurdertOpplæring({ query: { behandlingUuid } })).data;
  }

  // Reisetid
  async getVurdertReisetid(behandlingUuid: string) {
    return (await opplæringspenger_hentVurdertReisetid({ query: { behandlingUuid } })).data;
  }
}
