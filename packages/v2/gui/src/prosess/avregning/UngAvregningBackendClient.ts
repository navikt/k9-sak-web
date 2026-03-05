import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/combined/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';
import { dokument_hentForhåndsvisningVarselbrev } from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import type { FagsakYtelseType as FagsakYtelseTypeUngTilbake } from '@k9-sak-web/backend/ungtilbake/kodeverk/behandling/FagsakYtelseType.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { BehandlingAvregningBackendApiType } from './AvregningBackendApiType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

export default class UngAvregningBackendClient implements BehandlingAvregningBackendApiType {
  async bekreftAksjonspunktVurderFeilutbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
    videreBehandling: TilbakekrevingVidereBehandling,
    varseltekst?: string,
  ): Promise<void> {
    const body: BekreftedeAksjonspunkterDto = {
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
