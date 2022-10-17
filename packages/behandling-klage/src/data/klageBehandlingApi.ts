import { createRequestApi, RestApiConfigBuilder } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum KlageBehandlingApiKeys {
  BEHANDLING_KLAGE = 'BEHANDLING_KLAGE',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  KLAGE_VURDERING = 'KLAGE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  SAVE_KLAGE_VURDERING = 'SAVE_KLAGE_VURDERING',
  SAVE_REOPEN_KLAGE_VURDERING = 'SAVE_REOPEN_KLAGE_VURDERING',
  PARTER_MED_KLAGERETT = 'PARTER_MED_KLAGERETT',
  VALGT_PART_MED_KLAGERETT = 'VALGT_PART_MED_KLAGERETT',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/klage/api/behandlinger', KlageBehandlingApiKeys.BEHANDLING_KLAGE)

  // behandlingsdata
  .withRel('aksjonspunkter', KlageBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('klage-vurdering', KlageBehandlingApiKeys.KLAGE_VURDERING)
  .withRel('parter-klagerett', KlageBehandlingApiKeys.PARTER_MED_KLAGERETT)
  .withRel('valgt-part', KlageBehandlingApiKeys.VALGT_PART_MED_KLAGERETT)

  // operasjoner
  .withPost('/k9/klage/api/behandlinger/bytt-enhet', KlageBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/klage/api/behandlinger/henlegg', KlageBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/klage/api/behandlinger/gjenoppta', KlageBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/klage/api/behandlinger/sett-pa-vent', KlageBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/klage/api/behandlinger/endre-pa-vent', KlageBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/klage/api/behandling/aksjonspunkt', KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/k9/klage/api/klage-v2/mellomlagre-klage', KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING)
  .withAsyncPost(
    '/k9/klage/api/klage-v2/mellomlagre-gjennapne-klage',
    KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING,
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', KlageBehandlingApiKeys.PREVIEW_MESSAGE, { isResponseBlob: true })
  .withPost('/k9/formidling/api/brev/html', KlageBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)
  .build();

export const requestKlageApi = createRequestApi(endpoints);

export const restApiKlageHooks = RestApiHooks.initHooks(requestKlageApi);
