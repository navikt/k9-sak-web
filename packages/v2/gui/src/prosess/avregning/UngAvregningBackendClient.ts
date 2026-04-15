import { dokument_hentForhåndsvisningVarselbrev } from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import type { FagsakYtelseType as FagsakYtelseTypeUngTilbake } from '@k9-sak-web/backend/ungtilbake/kodeverk/behandling/FagsakYtelseType.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';

export class UngAvregningBackendClient implements BehandlingAvregningBackendApiType {
  async hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob> {
    return (
      await dokument_hentForhåndsvisningVarselbrev({
        body: {
          ytelsesbehandlingUuid: behandlingUuid,
          fagsakYtelseType: fagsakYtelseType as FagsakYtelseTypeUngTilbake,
          varseltekst,
        },
      })
    ).data as Blob;
  }
}
