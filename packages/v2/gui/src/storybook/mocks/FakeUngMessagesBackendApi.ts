import {
  type BestillInformasjonsbrevResponse,
  type ForhåndsvisInformasjonsbrevResponse,
  type InformasjonsbrevBestillingRequest,
  type InformasjonsbrevValgResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';

export class FakeUngMessagesBackendApi {
  async hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse> {
    ignoreUnusedDeclared(behandlingId);
    return {
      informasjonbrevValg: [
        {
          malType: {
            kode: 'GENERELT_FRITEKSTBREV',
            kodeverk: 'DOKUMENT_MAL_TYPE',
            navn: 'Fritekst generelt brev',
            kilde: 'GENERELT_FRITEKSTBREV',
          },
          mottakere: [{ id: '9904458010078', idType: 'AKTØRID', navn: 'Kolibir Nina', fnr: '04458010078' }],
          støtterFritekst: false,
          støtterTittelOgFritekst: true,
        },
      ],
    };
  }

  async bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<BestillInformasjonsbrevResponse> {
    ignoreUnusedDeclared(data);
    return Promise.resolve();
  }

  async forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse> {
    ignoreUnusedDeclared(data);
    return Promise.resolve(new Blob(['PDF'], { type: 'application/pdf' }));
  }
}
