import type { VurderingPerPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/inntektsmelding/VurderingPerPeriode.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface DokumenterApi extends BackendTilhørighet {
  hentVurderingerAvMottatteInntektsmeldinger(
    behandlingUuid: string,
    signal?: AbortSignal,
  ): Promise<VurderingPerPeriode>;
}
