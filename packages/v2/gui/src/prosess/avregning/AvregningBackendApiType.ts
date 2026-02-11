import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import type { foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';

export type BehandlingAvregningBackendApiType = {
  bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void>;
  bekreftAksjonspunktVurderFeilutbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
    videreBehandling: TilbakekrevingVidereBehandling,
    varseltekst?: string,
  ): Promise<void>;
  hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob>;
};
