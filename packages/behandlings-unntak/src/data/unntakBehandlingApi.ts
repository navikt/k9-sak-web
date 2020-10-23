import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const UnntakBehandlingApiKeys = {
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
  .withAsyncPost('/k9/sak/api/behandlinger', UnntakBehandlingApiKeys.BEHANDLING_FP)

  // behandlingsdata
  .withRel('oppgitt-opptjening-v2', UnntakBehandlingApiKeys.OPPGITT_OPPTJENING)
  .withRel('beregningsresultat-utbetalt', UnntakBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALT)
  .withRel('inntekt', UnntakBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('aksjonspunkter', UnntakBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UnntakBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', UnntakBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UnntakBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UnntakBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag', UnntakBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('beregningsresultat-foreldrepenger', UnntakBehandlingApiKeys.BEREGNINGRESULTAT)
  .withRel('opptjening-v2', UnntakBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', UnntakBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('uttak-kontroller-fakta-perioder', UnntakBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('vedtak-varsel', UnntakBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('tilgjengelige-vedtaksbrev', UnntakBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UnntakBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UnntakBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', UnntakBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UnntakBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UnntakBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UnntakBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UnntakBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', UnntakBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })

  /* FPTILBAKE */
  .withPostAndOpenBlob(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    UnntakBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* K9FORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', UnntakBehandlingApiKeys.PREVIEW_MESSAGE)
  .withRel('dokumentdata-lagre', UnntakBehandlingApiKeys.DOKUMENTDATA_LAGRE)

  .build();

const reducerName = 'dataContextUnntakBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const unntakBehandlingApi = reduxRestApi.getEndpointApi();
export default unntakBehandlingApi;
