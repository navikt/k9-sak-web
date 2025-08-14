import type {
  sif_tilbakekreving_web_app_tjenester_behandling_aksjonspunkt_dto_AksjonspunktDto as AksjonspunktDto,
  sif_tilbakekreving_web_app_tjenester_beregningsresultat_BeregningResultatDto as BeregningsresultatTilbakekreving,
  sif_tilbakekreving_behandling_modell_BehandlingFeilutbetalingFakta as FeilutbetalingFakta,
  sif_tilbakekreving_web_app_tjenester_behandling_aksjonspunkt_dto_VurderForeldelseDto as FeilutbetalingPerioderWrapper,
} from '@k9-sak-web/backend/ungtilbake/generated/types.js';

interface FetchedData {
  aksjonspunkter: AksjonspunktDto[];
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  beregningsresultat: BeregningsresultatTilbakekreving;
  feilutbetalingFakta: FeilutbetalingFakta;
}

export default FetchedData;
