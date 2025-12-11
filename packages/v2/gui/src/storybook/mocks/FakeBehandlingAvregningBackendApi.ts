import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  type k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  type k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  type k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
  backend: 'k9' | 'ung';

  #simuleringResultat: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto | undefined;
  #tilbakekrevingValg: k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto | undefined;

  constructor(backend: 'k9' | 'ung' = 'k9') {
    this.backend = backend;
  }

  setSimuleringResultat(resultat: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto) {
    this.#simuleringResultat = resultat;
  }

  setTilbakekrevingValg(valg: k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto) {
    this.#tilbakekrevingValg = valg;
  }

  async hentSimuleringResultat(behandlingUuid: string): Promise<k9_oppdrag_kontrakt_simulering_v1_SimuleringDto> {
    if (!this.#simuleringResultat) {
      throw new Error(`No simulering resultat set for behandling ${behandlingUuid}`);
    }
    return Promise.resolve(this.#simuleringResultat);
  }

  async hentTilbakekrevingValg(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto> {
    if (!this.#tilbakekrevingValg) {
      throw new Error(`No tilbakekreving valg set for behandling ${behandlingUuid}`);
    }
    return Promise.resolve(this.#tilbakekrevingValg);
  }
  #bekreftAksjonspunktSjekkHøyEtterbetaling: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto | undefined;

  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    this.#bekreftAksjonspunktSjekkHøyEtterbetaling = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
          begrunnelse,
        },
      ],
    };
    console.debug('Bekreftet aksjonspunkt', this.#bekreftAksjonspunktSjekkHøyEtterbetaling);
  }

  get sisteBekreftAksjonspunktResultat() {
    return this.#bekreftAksjonspunktSjekkHøyEtterbetaling;
  }

  reset() {
    this.#bekreftAksjonspunktSjekkHøyEtterbetaling = undefined;
  }
}
