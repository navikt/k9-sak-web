import type { k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import { dokument_hentForhåndsvisningVarselbrev } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';

export default class BehandlingAvregningBackendClient implements BehandlingAvregningBackendApiType {
  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    const body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
          begrunnelse,
        },
      ],
    };
    await aksjonspunkt_bekreft({ body });
  }

  async bekreftAksjonspunktVurderFeilutbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
    videreBehandling: TilbakekrevingVidereBehandling,
    varseltekst?: string,
  ): Promise<void> {
    const body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
          begrunnelse,
          videreBehandling,
          varseltekst,
        },
      ],
    };
    await aksjonspunkt_bekreft({ body });
  }

  async hentForhåndsvisningVarselbrev(
    behandlingUuid: string,
    fagsakYtelseType: foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType,
    varseltekst?: string,
  ): Promise<Blob> {
    return (await dokument_hentForhåndsvisningVarselbrev({ body: { behandlingUuid, fagsakYtelseType, varseltekst } }))
      .data as Blob;
  }
}
