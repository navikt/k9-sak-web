import type { VurderingPerPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/inntektsmelding/VurderingPerPeriode.js';

export interface DokumenterApi {
  hentVurderingerAvMottatteInntektsmeldinger(
    behandlingUuid: string,
    signal?: AbortSignal,
  ): Promise<VurderingPerPeriode>;
}
