import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const AnkeBehandlingApiKeys = {
  BEHANDLING_ANKE: 'BEHANDLING_ANKE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  ANKE_VURDERING: 'ANKE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_ANKE_VURDERING: 'SAVE_ANKE_VURDERING',
  SAVE_REOPEN_ANKE_VURDERING: 'SAVE_REOPEN_ANKE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', AnkeBehandlingApiKeys.BEHANDLING_ANKE, {
    fetchLinkDataAutomatically: false,
  })
  .withInjectedPath('aksjonspunkter', AnkeBehandlingApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', AnkeBehandlingApiKeys.VILKAR)
  .withInjectedPath('anke-vurdering', AnkeBehandlingApiKeys.ANKE_VURDERING)

  .withPost('/k9/sak/api/behandlinger/bytt-enhet', AnkeBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', AnkeBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', AnkeBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', AnkeBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', AnkeBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  })

  .withAsyncPost('/k9/sak/api/behandling/anke/mellomlagre-anke', AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING)
  .withAsyncPost(
    '/k9/sak/api/behandling/anke/mellomlagre-gjennapne-anke',
    AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING,
    {
      storeResultKey: AnkeBehandlingApiKeys.BEHANDLING_ANKE,
    },
  )

  /* fpformidling */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', AnkeBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextAnkeBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const ankeBehandlingApi = reduxRestApi.getEndpointApi();
export default ankeBehandlingApi;
