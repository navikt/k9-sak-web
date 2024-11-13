import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum MessagesApiKeys {
  HENT_PREUTFYLTE_FRITEKSTMALER = 'HENT_PREUTFYLTE_FRITEKSTMALER',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
}

const endpoints = new RestApiConfigBuilder()
  .withGet('/ung/feature-toggle/toggles.json', MessagesApiKeys.FEATURE_TOGGLE)
  .withRel('malinnhold', MessagesApiKeys.HENT_PREUTFYLTE_FRITEKSTMALER)
  .build();

export const requestMessagesApi = createRequestApi(endpoints);

export const restApiMessagesHooks = RestApiHooks.initHooks(requestMessagesApi);
