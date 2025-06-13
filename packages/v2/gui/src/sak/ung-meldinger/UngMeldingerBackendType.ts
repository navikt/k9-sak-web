import type {
  BestillInformasjonsbrevResponse,
  ForhåndsvisInformasjonsbrevResponse,
  InformasjonsbrevBestillingDto,
  InformasjonsbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';

export interface UngMeldingerBackendType {
  bestillBrev(data: InformasjonsbrevBestillingDto): Promise<BestillInformasjonsbrevResponse>;
  forhåndsvisBrev(data: InformasjonsbrevBestillingDto): Promise<ForhåndsvisInformasjonsbrevResponse>;
  hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse>;
}
