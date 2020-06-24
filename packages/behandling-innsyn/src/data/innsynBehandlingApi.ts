import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const InnsynBehandlingApiKeys = {
  BEHANDLING_INNSYN: 'BEHANDLING_INNSYN',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  INNSYN: 'INNSYN',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  INNSYN_DOKUMENTER: 'INNSYN_DOKUMENTER',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING_INNSYN)

  // behandlingsdata
  .withRel('aksjonspunkter', InnsynBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', InnsynBehandlingApiKeys.VILKAR)
  .withRel('innsyn', InnsynBehandlingApiKeys.INNSYN)
  .withRel('dokumenter', InnsynBehandlingApiKeys.INNSYN_DOKUMENTER)

  // operasjoner
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', InnsynBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', InnsynBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', InnsynBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: InnsynBehandlingApiKeys.BEHANDLING_INNSYN,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', InnsynBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: InnsynBehandlingApiKeys.BEHANDLING_INNSYN,
  })

  /* FPFORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextInnsynBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const innsynBehandlingApi = reduxRestApi.getEndpointApi();
export default innsynBehandlingApi;
