import { kompletthet_utledVurderingerAvMottatteInntektsmeldinger } from '@k9-sak-web/backend/k9sak/tjenester/behandling/kompletthet/KompletthetInntektsmeldingApi.js';
import type { VurderingPerPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/inntektsmelding/VurderingPerPeriode.js';
import type { DokumenterApi } from './DokumenterApi.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9SakDokumenterBackendClient implements DokumenterApi {
  readonly backend = backendNavn.k9sak;

  async hentVurderingerAvMottatteInntektsmeldinger(
    behandlingUuid: string,
    signal?: AbortSignal,
  ): Promise<VurderingPerPeriode> {
    const response = await kompletthet_utledVurderingerAvMottatteInntektsmeldinger({
      query: { behandlingUuid },
      signal,
    });
    return response.data;
  }
}
