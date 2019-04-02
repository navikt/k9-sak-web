import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const InnsynBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', InnsynBehandlingApiKeys.BEHANDLING, { linksToFetchAutomatically: ['innsyn', 'aksjonspunkter', 'vilkar'] })
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT,
    { linksToFetchAutomatically: ['innsyn', 'aksjonspunkter', 'vilkar'] })

  /* /api/brev */
  .withPostAndOpenBlob('/fpsak/api/brev/forhandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE)
  .withPost('/fpsak/api/brev/bestill', InnsynBehandlingApiKeys.SUBMIT_MESSAGE)

/* /api/brev */
  .build();


const reducerName = 'dataContextInnsynBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const innsynBehandlingApi = reduxRestApi.getEndpointApi();
export default innsynBehandlingApi;
