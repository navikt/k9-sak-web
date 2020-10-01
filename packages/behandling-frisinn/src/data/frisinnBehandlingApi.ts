import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const FrisinnBehandlingApiKeys = {
  BEHANDLING_FP: 'BEHANDLING_FP',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGSGRUNNLAG: 'BEREGNINGSGRUNNLAG',
  BEREGNINGRESULTAT: 'BEREGNINGRESULTAT',
  BEREGNINGSRESULTAT_UTBETALT: 'BEREGNINGSRESULTAT_UTBETALT',
  OPPTJENING: 'OPPTJENING',
  INNTEKT_OG_YTELSER: 'INNTEKT_OG_YTELSER',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  UTTAK_KONTROLLER_FAKTA_PERIODER: 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  VEDTAK_VARSEL: 'VEDTAK_VARSEL',
  OPPGITT_OPPTJENING: 'OPPGITT_OPPTJENING',
  TILGJENGELIGE_VEDTAKSBREV: 'TILGJENGELIGE_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE: 'DOKUMENTDATA_LAGRE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', FrisinnBehandlingApiKeys.BEHANDLING_FP)

  // behandlingsdata
  .withRel('oppgitt-opptjening-v2', FrisinnBehandlingApiKeys.OPPGITT_OPPTJENING)
  .withRel('beregningsresultat-utbetalt', FrisinnBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALT)
  .withRel('inntekt', FrisinnBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('aksjonspunkter', FrisinnBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', FrisinnBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', FrisinnBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', FrisinnBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', FrisinnBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag', FrisinnBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('beregningsresultat-foreldrepenger', FrisinnBehandlingApiKeys.BEREGNINGRESULTAT)
  .withRel('opptjening-v2', FrisinnBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', FrisinnBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('uttak-kontroller-fakta-perioder', FrisinnBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('vedtak-varsel', FrisinnBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('tilgjengelige-vedtaksbrev', FrisinnBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', FrisinnBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', FrisinnBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', FrisinnBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', FrisinnBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', FrisinnBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', FrisinnBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', FrisinnBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', FrisinnBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })

  /* FPTILBAKE */
  .withPostAndOpenBlob(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    FrisinnBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* K9FORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', FrisinnBehandlingApiKeys.PREVIEW_MESSAGE)
  .withRel('dokumentdata-lagre', FrisinnBehandlingApiKeys.DOKUMENTDATA_LAGRE)

  .build();

const reducerName = 'dataContextFPBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const frisinnBehandlingApi = reduxRestApi.getEndpointApi();
export default frisinnBehandlingApi;
