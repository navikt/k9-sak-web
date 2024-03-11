import { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import { BackendApi } from './MeldingIndex';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';

export default class MeldingBackendClient implements BackendApi {
  async getBrevMottakerinfoEreg(organisasjonsnr: string): Promise<EregOrganizationLookupResponse> {
    const resp = await requestApi.startRequest(K9sakApiKeys.BREV_MOTTAKER_ORGANISASJON, { organisasjonsnr });
    if (resp.payload?.navn) {
      // Fant namn på gitt organisasjonsnr
      return { name: resp.payload.navn };
    }
    // Fant ikkje gitt organisasjonsnr
    return { notFound: true };
  }
}
