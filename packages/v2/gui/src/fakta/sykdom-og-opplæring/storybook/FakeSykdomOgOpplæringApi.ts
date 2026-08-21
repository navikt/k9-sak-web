/* eslint-disable @typescript-eslint/no-unused-vars */
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
import type { SykdomOgOpplæringApi } from '../api/SykdomOgOpplæringApi.js';

export class FakeSykdomOgOpplæringApi implements SykdomOgOpplæringApi {
  constructor(
    private readonly data: {
      vilkår?: GetVilkårV3Response;
      langvarigSykVurderinger?: HentLangvarigSykVurderingerFagsakResponse;
      vurdertLangvarigSykdom?: HentVurdertLangvarigSykdomResponse;
      institusjonInfo?: HentVurdertInstitusjonResponse;
      alleInstitusjoner?: HentAlleV2Response;
      vurdertOpplæring?: HentVurdertOpplæringResponse;
      vurdertReisetid?: HentVurdertReisetidResponse;
    } = {},
  ) {}

  async getVilkår(_behandlingUuid: string): Promise<GetVilkårV3Response> {
    return this.data.vilkår ?? [];
  }

  async opprettSykdomsvurdering(
    _payload: OpprettLangvarigSykdomsVurderingData['body'],
  ): Promise<OpprettLangvarigSykdomsVurderingResponse> {
    throw new Error('opprettSykdomsvurdering not configured in FakeSykdomOgOpplæringApi');
  }

  async hentLangvarigSykVurderingerFagsak(_behandlingUuid: string): Promise<HentLangvarigSykVurderingerFagsakResponse> {
    return this.data.langvarigSykVurderinger ?? [];
  }

  async hentVurdertLangvarigSykdom(_behandlingUuid: string): Promise<HentVurdertLangvarigSykdomResponse> {
    if (!this.data.vurdertLangvarigSykdom) throw new Error('vurdertLangvarigSykdom not configured');
    return this.data.vurdertLangvarigSykdom;
  }

  async getInstitusjonInfo(_behandlingUuid: string): Promise<HentVurdertInstitusjonResponse> {
    if (!this.data.institusjonInfo) throw new Error('institusjonInfo not configured');
    return this.data.institusjonInfo;
  }

  async hentAlleInstitusjoner(): Promise<HentAlleV2Response> {
    return this.data.alleInstitusjoner ?? [];
  }

  async hentOrganisasjonsnummer(_organisasjonsnummer: string): Promise<GetBrevMottakerinfoEregResponse> {
    return null;
  }

  async getVurdertOpplæring(_behandlingUuid: string): Promise<HentVurdertOpplæringResponse> {
    if (!this.data.vurdertOpplæring) throw new Error('vurdertOpplæring not configured');
    return this.data.vurdertOpplæring;
  }

  async getVurdertReisetid(_behandlingUuid: string): Promise<HentVurdertReisetidResponse> {
    if (!this.data.vurdertReisetid) throw new Error('vurdertReisetid not configured');
    return this.data.vurdertReisetid;
  }
}
