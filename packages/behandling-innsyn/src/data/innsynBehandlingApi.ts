import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum InnsynBehandlingApiKeys {
  BEHANDLING_INNSYN = 'BEHANDLING_INNSYN',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  INNSYN = 'INNSYN',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  INNSYN_DOKUMENTER = 'INNSYN_DOKUMENTER',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
}

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
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', InnsynBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', InnsynBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', InnsynBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT)

  /* FPFORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', InnsynBehandlingApiKeys.PREVIEW_MESSAGE, { isResponseBlob: true })
  .withPost('/k9/formidling/api/brev/html', InnsynBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)
  .build();

export const requestInnsynApi = createRequestApi(endpoints);

export const restApiInnsynHooks = RestApiHooks.initHooks(requestInnsynApi);
