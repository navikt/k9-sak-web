import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import {
  InformasjonsbrevBestillingDtoInformasjonsbrevMalType,
  type BestillInformasjonsbrevResponse,
  type ForhåndsvisInformasjonsbrevResponse,
  type InformasjonsbrevBestillingDto,
  type InformasjonsbrevValgResponse,
  type UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';
import type { EregOrganizationLookupResponse } from '../meldinger/EregOrganizationLookupResponse';

export default class UngMeldingerBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsak: UngSakClient) {
    this.#ungsak = ungsak;
  }

  async hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse> {
    return this.#ungsak.formidling.informasjonsbrevValg(`${behandlingId}`);
  }

  async bestillDokument(data: BestillBrevDto): Promise<BestillInformasjonsbrevResponse> {
    const informasjonsbrevBestillingDto: InformasjonsbrevBestillingDto = {
      behandlingId: data.behandlingId,
      informasjonsbrevMalType: InformasjonsbrevBestillingDtoInformasjonsbrevMalType.GENERELT_FRITEKSTBREV,
      innhold: { overskrift: data.fritekstbrev?.overskrift, brødtekst: data.fritekstbrev?.brødtekst || data.fritekst },
      mottaker: { id: data.overstyrtMottaker?.id, type: data.overstyrtMottaker?.idType },
    };
    return this.#ungsak.formidling.bestillInformasjonsbrev(informasjonsbrevBestillingDto);
  }

  async lagForhåndsvisningPdf(
    data: ForhåndsvisDto,
    behandlingId: number,
  ): Promise<ForhåndsvisInformasjonsbrevResponse> {
    const informasjonsbrevBestillingDto: InformasjonsbrevBestillingDto = {
      behandlingId: behandlingId,
      informasjonsbrevMalType: InformasjonsbrevBestillingDtoInformasjonsbrevMalType.GENERELT_FRITEKSTBREV,
      innhold: {
        overskrift: data.dokumentdata?.fritekstbrev?.overskrift,
        brødtekst: data.dokumentdata?.fritekstbrev?.brødtekst || data.dokumentdata?.fritekst,
      },
      mottaker: { id: data.overstyrtMottaker?.id, type: data.overstyrtMottaker?.idType },
    };
    return this.#ungsak.formidling.forhåndsvisInformasjonsbrev(informasjonsbrevBestillingDto);
  }

  // Denne skal vi egentlig ikke bruke i Ung
  async getBrevMottakerinfoEreg(orgnr: string): Promise<EregOrganizationLookupResponse> {
    return { name: orgnr };
  }

  async hentInnholdBrevmal() {
    return [];
  }
}
