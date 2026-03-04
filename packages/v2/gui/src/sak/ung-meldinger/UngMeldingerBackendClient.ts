import type { ForhåndsvisInformasjonsbrevResponse } from '@k9-sak-web/backend/ungsak/tjenester/ForhåndsvisInformasjonsbrevResponse.js';
import type { InformasjonsbrevBestillingRequest } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/informasjonsbrev/InformasjonsbrevBestillingRequest.js';
import type { InformasjonsbrevValgResponse } from '@k9-sak-web/backend/ungsak/tjenester/InformasjonsbrevValgResponse.js';
import {
  bestillInformasjonsbrev,
  forhåndsvisInformasjonsbrev,
  hentInformasjonsbrevValg,
} from '@k9-sak-web/backend/ungsak/sdk.js';

export default class UngMeldingerBackendClient {
  async hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse> {
    return (await hentInformasjonsbrevValg({ query: { behandlingId: `${behandlingId}` } })).data;
  }

  async bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<void> {
    await bestillInformasjonsbrev({ body: data });
  }

  async forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse> {
    return (await forhåndsvisInformasjonsbrev({ body: data })).data;
  }
}
