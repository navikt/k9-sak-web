import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum AnkeBehandlingApiKeys {
  BEHANDLING_ANKE = 'BEHANDLING_ANKE',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  ANKE_VURDERING = 'ANKE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
  SAVE_ANKE_VURDERING = 'SAVE_ANKE_VURDERING',
  SAVE_REOPEN_ANKE_VURDERING = 'SAVE_REOPEN_ANKE_VURDERING',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', AnkeBehandlingApiKeys.BEHANDLING_ANKE)

  // behandlingsdata
  .withRel('aksjonspunkter', AnkeBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', AnkeBehandlingApiKeys.VILKAR)
  .withRel('anke-vurdering', AnkeBehandlingApiKeys.ANKE_VURDERING)

  // operasjoner
  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', AnkeBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', AnkeBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', AnkeBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', AnkeBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', AnkeBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/k9/sak/api/behandling/anke/mellomlagre-anke', AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING)
  .withAsyncPost(
    '/k9/sak/api/behandling/anke/mellomlagre-gjennapne-anke',
    AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING,
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', AnkeBehandlingApiKeys.PREVIEW_MESSAGE, { isResponseBlob: true })
  .withPost('/k9/formidling/api/brev/html', AnkeBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)
  .build();

export const requestAnkeApi = createRequestApi(endpoints);

export const restApiAnkeHooks = RestApiHooks.initHooks(requestAnkeApi);
