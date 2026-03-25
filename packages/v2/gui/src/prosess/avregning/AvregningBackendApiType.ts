import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/combined/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';

export type BehandlingAvregningBackendApiType = {
  // denne er optional fordi aksjonspunktet SJEKK_HØY_ETTERBETALING kun finnes i k9sak, og ikke i ungsak. 
  bekreftAksjonspunktSjekkHøyEtterbetaling?(
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
    fagsakYtelseType: FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob>;
};
