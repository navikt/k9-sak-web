import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum MessagesApiKeys {
  HENT_PREUTFYLTE_FRITEKSTMALER = 'HENT_PREUTFYLTE_FRITEKSTMALER',
}

const endpoints = new RestApiConfigBuilder()
  .withRel('malinnhold', MessagesApiKeys.HENT_PREUTFYLTE_FRITEKSTMALER)
  .build();

export const requestMessagesApi = createRequestApi(endpoints);

export const restApiMessagesHooks = RestApiHooks.initHooks(requestMessagesApi);
