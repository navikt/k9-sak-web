import type {
  GetBrevMottakerinfoEregResponse,
  GetVilkårV3Response,
  HentAlleV2Response,
  HentLangvarigSykVurderingerFagsakResponse,
  HentVurdertInstitusjonResponse,
  HentVurdertLangvarigSykdomResponse,
  HentVurdertOpplæringResponse,
  HentVurdertReisetidResponse,
  OpprettLangvarigSykdomsVurderingData,
  OpprettLangvarigSykdomsVurderingResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export interface SykdomOgOpplæringApi {
  getVilkår(behandlingUuid: string): Promise<GetVilkårV3Response>;
  opprettSykdomsvurdering(
    payload: OpprettLangvarigSykdomsVurderingData['body'],
  ): Promise<OpprettLangvarigSykdomsVurderingResponse>;
  hentLangvarigSykVurderingerFagsak(behandlingUuid: string): Promise<HentLangvarigSykVurderingerFagsakResponse>;
  hentVurdertLangvarigSykdom(behandlingUuid: string): Promise<HentVurdertLangvarigSykdomResponse>;
  getInstitusjonInfo(behandlingUuid: string): Promise<HentVurdertInstitusjonResponse>;
  hentAlleInstitusjoner(): Promise<HentAlleV2Response>;
  hentOrganisasjonsnummer(organisasjonsnummer: string): Promise<GetBrevMottakerinfoEregResponse>;
  getVurdertOpplæring(behandlingUuid: string): Promise<HentVurdertOpplæringResponse>;
  getVurdertReisetid(behandlingUuid: string): Promise<HentVurdertReisetidResponse>;
}
