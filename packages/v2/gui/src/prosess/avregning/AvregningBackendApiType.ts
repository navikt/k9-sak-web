import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';

export type BehandlingAvregningBackendApiType = {
  hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob>;
};
