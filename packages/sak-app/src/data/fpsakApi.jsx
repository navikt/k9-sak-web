import {
  reducerRegistry,
  setRequestPollingMessage,
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const FpsakApiKeys = {
  LANGUAGE_FILE: 'LANGUAGE_FILE',
  KODEVERK: 'KODEVERK',
  KODEVERK_FPTILBAKE: 'KODEVERK_FPTILBAKE',
  KODEVERK_KLAGE: 'KODEVERK_KLAGE',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  FETCH_FAGSAK: 'FETCH_FAGSAK',
  BEHANDLINGER_FPSAK: 'BEHANDLINGER_FPSAK',
  BEHANDLINGER_FPTILBAKE: 'BEHANDLINGER_FPTILBAKE',
  BEHANDLINGER_KLAGE: 'BEHANDLINGER_KLAGE',
  ANNEN_PART_BEHANDLING: 'ANNEN_PART_BEHANDLING',
  BEHANDLENDE_ENHETER: 'BEHANDLENDE_ENHETER',
  NEW_BEHANDLING_FPSAK: 'NEW_BEHANDLING_FPSAK',
  NEW_BEHANDLING_FPTILBAKE: 'NEW_BEHANDLING_FPTILBAKE',
  NEW_BEHANDLING_KLAGE: 'NEW_BEHANDLING_KLAGE',
  ALL_DOCUMENTS: 'ALL_DOCUMENTS',
  DOCUMENT: 'DOCUMENT',
  HISTORY_FPSAK: 'HISTORY_FPSAK',
  HISTORY_FPTILBAKE: 'HISTORY_FPTILBAKE',
  HISTORY_KLAGE: 'HISTORY_KLAGE',
  SHOW_DETAILED_ERROR_MESSAGES: 'SHOW_DETAILED_ERROR_MESSAGES',
  INTEGRATION_STATUS: 'INTEGRATION_STATUS',
  FEATURE_TOGGLE: 'FEATURE_TOGGLE',
  AKTOER_INFO: 'AKTOER_INFO',
  KONTROLLRESULTAT: 'KONTROLLRESULTAT',
  RISIKO_AKSJONSPUNKT: 'RISIKO_AKSJONSPUNKT',
  TOTRINNSAKSJONSPUNKT_ARSAKER: 'TOTRINNSAKSJONSPUNKT_ARSAKER',
  SAVE_TOTRINNSAKSJONSPUNKT: 'SAVE_TOTRINNSAKSJONSPUNKT',
  TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY: 'TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY',
  BREVMALER: 'BREVMALER',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  PREVIEW_MESSAGE_TILBAKEKREVING: 'PREVIEW_MESSAGE_TILBAKEKREVING',
  PREVIEW_MESSAGE_FORMIDLING: 'PREVIEW_MESSAGE_FORMIDLING',
  PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE: 'PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE',
  KAN_TILBAKEKREVING_OPPRETTES: 'KAN_TILBAKEKREVING_OPPRETTES',
  KAN_TILBAKEKREVING_REVURDERING_OPPRETTES: 'KAN_TILBAKEKREVING_REVURDERING_OPPRETTES',
  VERGE_MENYVALG: 'VERGE_MENYVALG',
  MENYHANDLING_RETTIGHETER: 'MENYHANDLING_RETTIGHETER',
  HAR_APENT_KONTROLLER_REVURDERING_AP: 'HAR_APENT_KONTROLLER_REVURDERING_AP',
  TOTRINNS_KLAGE_VURDERING: 'TOTRINNS_KLAGE_VURDERING',
  HAR_REVURDERING_SAMME_RESULTAT: 'HAR_REVURDERING_SAMME_RESULTAT',
  BEHANDLING_PERSONOPPLYSNINGER: 'BEHANDLING_PERSONOPPLYSNINGER',
};

const endpoints = new RestApiConfigBuilder()

  /* /api/fagsak */
  .withPost('/k9/sak/api/fagsak/sok', FpsakApiKeys.SEARCH_FAGSAK)
  .withGet('/k9/sak/api/fagsak', FpsakApiKeys.FETCH_FAGSAK)

  /* /k9/sak/api/behandlinger */
  .withGet('/k9/sak/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPSAK, { fetchLinkDataAutomatically: false })
  .withAsyncPut('/k9/sak/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_FPSAK, { fetchLinkDataAutomatically: false })
  .withGet('/k9/sak/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .withRel('bytt-behandlende-enhet', FpsakApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('opne-for-endringer', FpsakApiKeys.OPEN_BEHANDLING_FOR_CHANGES)
  .withRel('henlegg-behandling', FpsakApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', FpsakApiKeys.RESUME_BEHANDLING)
  .withRel('sett-behandling-pa-vent', FpsakApiKeys.BEHANDLING_ON_HOLD)
  .withRel('finn-menyvalg-for-verge', FpsakApiKeys.VERGE_MENYVALG)
  .withRel('handling-rettigheter', FpsakApiKeys.MENYHANDLING_RETTIGHETER)
  .withRel('soeker-personopplysninger', FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)

  /* /fptilbake/api/behandlinger */
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE)
  .withAsyncPost('/fptilbake/api/behandlinger/opprett', FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE, {
    fetchLinkDataAutomatically: false,
  })
  .withGet('/fptilbake/api/behandlinger/kan-opprettes', FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES)
  .withGet(
    '/fptilbake/api/behandlinger/kan-revurdering-opprettes',
    FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES,
  )
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE)
  .withGet(
    '/fptilbake/api/behandlinger/kan-revurdering-opprettes',
    FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES,
  )
  .withGet('/fptilbake/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_FPTILBAKE, {
    fetchLinkDataAutomatically: false,
  })

  /* /api/behandling/beregningsresultat */
  .withRel('har-samme-resultat', FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT)

  /* Totrinnskontroll */
  .withRel('totrinnskontroll-arsaker', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER)
  .withRel('bekreft-totrinnsaksjonspunkt', FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT)
  .withRel('totrinnskontroll-arsaker-readOnly', FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY)
  .withRel('klage-vurdering', FpsakApiKeys.TOTRINNS_KLAGE_VURDERING)

  /* Brev */
  .withGet('/k9/formidling/api/brev/maler', FpsakApiKeys.BREVMALER)
  .withRel('brev-bestill', FpsakApiKeys.SUBMIT_MESSAGE)
  .withRel('har-apent-kontroller-revurdering-aksjonspunkt', FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP)

  /* Kontrollresultat */
  .withRel('kontrollresultat', FpsakApiKeys.KONTROLLRESULTAT)
  .withRel('risikoklassifisering-aksjonspunkt', FpsakApiKeys.RISIKO_AKSJONSPUNKT)

  /* /api/dokument */
  .withGet('/k9/sak/api/dokument/hent-dokumentliste', FpsakApiKeys.ALL_DOCUMENTS)
  .withGet('/k9/sak/api/dokument/hent-dokument', FpsakApiKeys.DOCUMENT)

  /* /api/historikk */
  .withGet('/k9/sak/api/historikk', FpsakApiKeys.HISTORY_FPSAK)
  .withGet('/fptilbake/api/historikk', FpsakApiKeys.HISTORY_FPTILBAKE)
  .withGet('/k9/klage/api/historikk', FpsakApiKeys.HISTORY_KLAGE)

  /* /api/kodeverk */
  .withGet('/k9/sak/api/kodeverk', FpsakApiKeys.KODEVERK)
  .withGet('/fptilbake/api/kodeverk', FpsakApiKeys.KODEVERK_FPTILBAKE)
  .withGet('/k9/klage/api/kodeverk', FpsakApiKeys.KODEVERK_KLAGE)
  .withGet('/k9/sak/api/kodeverk/behandlende-enheter', FpsakApiKeys.BEHANDLENDE_ENHETER)

  /* /api/nav-ansatt */
  .withGet('/k9/sak/api/nav-ansatt', FpsakApiKeys.NAV_ANSATT)

  /* /api/integrasjon */
  .withGet('/k9/sak/api/integrasjon/status', FpsakApiKeys.INTEGRATION_STATUS)
  .withGet('/k9/sak/api/integrasjon/status/vises', FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES)

  /* /api/aktoer */
  .withGet('/k9/sak/api/aktoer-info', FpsakApiKeys.AKTOER_INFO)

  /* k9/formidling/api/brev */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING)
  .withPostAndOpenBlob('/fptilbake/api/brev/forhandsvis', FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING)
  .withPostAndOpenBlob(
    '/fptilbake/api/dokument/forhandsvis-henleggelsesbrev',
    FpsakApiKeys.PREVIEW_MESSAGE_TILBAKEKREVING_HENLEGGELSE,
  )

  /* /sprak */
  .withGet('/k9/web/sprak/nb_NO.json', FpsakApiKeys.LANGUAGE_FILE)

  /* /api/feature-toggle */
  .withPost('/k9/sak/api/feature-toggle', FpsakApiKeys.FEATURE_TOGGLE)

  /* Klage */
  .withGet('/k9/klage/api/behandlinger/alle', FpsakApiKeys.BEHANDLINGER_KLAGE)
  .withAsyncPut('/k9/klage/api/behandlinger', FpsakApiKeys.NEW_BEHANDLING_KLAGE)

  .build();

const reducerName = 'dataContext';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakApi = reduxRestApi.getEndpointApi();
export default fpsakApi;
