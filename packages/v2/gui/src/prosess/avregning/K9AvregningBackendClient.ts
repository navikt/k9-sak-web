import { dokument_hentForhåndsvisningVarselbrev } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { FagsakYtelseType as FagsakYtelseTypeK9Tilbake } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/FagsakYtelseType.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';

export class K9AvregningBackendClient implements BehandlingAvregningBackendApiType {
  async hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob> {
    return (
      await dokument_hentForhåndsvisningVarselbrev({
        body: { behandlingUuid, fagsakYtelseType: fagsakYtelseType as FagsakYtelseTypeK9Tilbake, varseltekst },
      })
    ).data as Blob;
  }
}
