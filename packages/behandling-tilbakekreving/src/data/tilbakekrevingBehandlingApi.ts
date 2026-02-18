import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum TilbakekrevingBehandlingApiKeys {
  BEHANDLING_TILBAKE = 'BEHANDLING_TILBAKE',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VEDTAKSBREV = 'VEDTAKSBREV',
  BEREGNINGSRESULTAT = 'BEREGNINGSRESULTAT',
  FEILUTBETALING_FAKTA = 'FEILUTBETALING_FAKTA',
  FEILUTBETALING_AARSAK = 'FEILUTBETALING_AARSAK',
  PERIODER_FORELDELSE = 'PERIODER_FORELDELSE',
  VILKARVURDERINGSPERIODER = 'VILKARVURDERINGSPERIODER',
  VILKARVURDERING = 'VILKARVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  BEREGNE_BELØP = 'BEREGNE_BELØP',
  TILBAKE_KODEVERK = 'TILBAKE_KODEVERK',
  PREVIEW_VEDTAKSBREV = 'PREVIEW_VEDTAKSBREV',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
  VERGE = 'VERGE',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/tilbake/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE)
  .withGet('/k9/tilbake/api/kodeverk', TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK)

  // behandlingsdata
  .withRel('aksjonspunkter', TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vedtaksbrev', TilbakekrevingBehandlingApiKeys.VEDTAKSBREV)
  .withRel('beregningsresultat', TilbakekrevingBehandlingApiKeys.BEREGNINGSRESULTAT)
  .withRel('feilutbetalingFakta', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA)
  .withRel('feilutbetalingAarsak', TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK)
  .withRel('perioderForeldelse', TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE)
  .withRel('vilkarvurderingsperioder', TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER)
  .withRel('vilkarvurdering', TilbakekrevingBehandlingApiKeys.VILKARVURDERING)
  .withRel('soeker-verge', TilbakekrevingBehandlingApiKeys.VERGE)

  // operasjoner
  .withRel('beregne-feilutbetalt-belop', TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP)
  .withRel('bytt-behandlende-enhet', TilbakekrevingBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', TilbakekrevingBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', TilbakekrevingBehandlingApiKeys.RESUME_BEHANDLING)
  .withRel('sett-behandling-pa-vent', TilbakekrevingBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('lagre-aksjonspunkter', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withRel('opprett-verge', TilbakekrevingBehandlingApiKeys.VERGE_OPPRETT)
  .withRel('fjern-verge', TilbakekrevingBehandlingApiKeys.VERGE_FJERN)

  /* FPFORMIDLING */
  .withPost('/k9/tilbake/api/dokument/forhandsvis-vedtaksbrev', TilbakekrevingBehandlingApiKeys.PREVIEW_VEDTAKSBREV, {
    isResponseBlob: true,
  })
  .withPost('/k9/formidling/api/brev/html', TilbakekrevingBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestTilbakekrevingApi = createRequestApi(endpoints);

export const restApiTilbakekrevingHooks = RestApiHooks.initHooks(requestTilbakekrevingApi);
