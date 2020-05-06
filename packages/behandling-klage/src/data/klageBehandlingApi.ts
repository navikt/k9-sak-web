import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const KlageBehandlingApiKeys = {
  BEHANDLING_KLAGE: 'BEHANDLING_KLAGE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  KLAGE_VURDERING: 'KLAGE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_KLAGE_VURDERING: 'SAVE_KLAGE_VURDERING',
  SAVE_REOPEN_KLAGE_VURDERING: 'SAVE_REOPEN_KLAGE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/klage/api/behandlinger', KlageBehandlingApiKeys.BEHANDLING_KLAGE)

  // behandlingsdata
  .withRel('aksjonspunkter', KlageBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', KlageBehandlingApiKeys.VILKAR)
  .withRel('klage-vurdering', KlageBehandlingApiKeys.KLAGE_VURDERING)

  .withPost('/k9/klage/api/behandlinger/bytt-enhet', KlageBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/klage/api/behandlinger/henlegg', KlageBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/klage/api/behandlinger/gjenoppta', KlageBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  })
  .withPost('/k9/klage/api/behandlinger/sett-pa-vent', KlageBehandlingApiKeys.BEHANDLING_ON_HOLD)

  .withPost('/k9/klage/api/behandlinger/endre-pa-vent', KlageBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/klage/api/behandling/aksjonspunkt', KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  })
  .withAsyncPost('/k9/klage/api/behandling/klage/mellomlagre-klage', KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost(
    '/k9/klage/api/behandling/klage/mellomlagre-gjennapne-klage',
    KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING,
    {
      saveResponseIn: KlageBehandlingApiKeys.BEHANDLING_KLAGE,
    },
  )

  /* K9FORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', KlageBehandlingApiKeys.PREVIEW_MESSAGE)
  .build();

const reducerName = 'dataContextKlageBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const klageBehandlingApi = reduxRestApi.getEndpointApi();
export default klageBehandlingApi;
