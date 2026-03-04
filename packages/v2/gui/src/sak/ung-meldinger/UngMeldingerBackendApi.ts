import type { ForhåndsvisInformasjonsbrevResponse } from '@k9-sak-web/backend/ungsak/tjenester/ForhåndsvisInformasjonsbrevResponse.js';
import type { InformasjonsbrevBestillingRequest } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/informasjonsbrev/InformasjonsbrevBestillingRequest.js';
import type { InformasjonsbrevValgResponse } from '@k9-sak-web/backend/ungsak/tjenester/InformasjonsbrevValgResponse.js';

export interface UngMeldingerBackendApi {
  bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<void>;
  forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse>;
  hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse>;
}
