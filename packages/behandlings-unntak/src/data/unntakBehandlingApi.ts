import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const UnntakBehandlingApiKeys = {
  BEHANDLING_UNNTAK: 'BEHANDLING_UNNTAK',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  KLAGE_VURDERING: 'KLAGE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  DOKUMENTDATA_LAGRE: 'DOKUMENTDATA_LAGRE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/api/behandlinger', UnntakBehandlingApiKeys.BEHANDLING_UNNTAK)

  // behandlingsdata
  .withRel('aksjonspunkter', UnntakBehandlingApiKeys.AKSJONSPUNKTER)

  // operasjoner
  .withPost('/k9/api/behandlinger/bytt-enhet', UnntakBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/api/behandlinger/henlegg', UnntakBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withPost('/k9/api/behandlinger/sett-pa-vent', UnntakBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/k9/api/behandlinger/endre-pa-vent', UnntakBehandlingApiKeys.UPDATE_ON_HOLD)

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
