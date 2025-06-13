import type {
  BestillInformasjonsbrevResponse,
  ForhåndsvisInformasjonsbrevResponse,
  InformasjonsbrevBestillingRequest,
  InformasjonsbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export interface UngMeldingerBackendType {
  bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<BestillInformasjonsbrevResponse>;
  forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse>;
  hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse>;
}
