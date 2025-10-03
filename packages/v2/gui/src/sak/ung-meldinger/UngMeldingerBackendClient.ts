import type {
  ForhåndsvisInformasjonsbrevResponse,
  ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevBestillingRequest as InformasjonsbrevBestillingRequest,
  InformasjonsbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import {
  formidling_bestillInformasjonsbrev,
  formidling_forhåndsvisInformasjonsbrev,
  formidling_informasjonsbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';

export default class UngMeldingerBackendClient {
  async hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse> {
    return (await formidling_informasjonsbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }

  async bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<void> {
    await formidling_bestillInformasjonsbrev({ body: data });
  }

  async forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse> {
    return (await formidling_forhåndsvisInformasjonsbrev({ body: data })).data;
  }
}
