import type {
  k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type BehandlingAvregningBackendApiType = {
  backend: 'k9' | 'ung';
  bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void>;

  hentSimuleringResultat(behandlingUuid: string): Promise<k9_oppdrag_kontrakt_simulering_v1_SimuleringDto>;
  hentTilbakekrevingValg(behandlingUuid: string): Promise<k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto>;
};
