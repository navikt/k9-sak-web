import type {
  ForhåndsvisInformasjonsbrevResponse,
  ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevBestillingRequest as InformasjonsbrevBestillingRequest,
  InformasjonsbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface UngMeldingerBackendApi {
  bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<void>;
  forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse>;
  hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse>;
}
