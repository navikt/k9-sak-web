import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum MessagesApiKeys {
  HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER = 'HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER',
  FEATURE_TOGGLE = 'FEATURE_TOGGLE',
}

const endpoints = new RestApiConfigBuilder()
  .withGet('/k9/feature-toggle/toggles.json', MessagesApiKeys.FEATURE_TOGGLE)
  .withRel('malinnhold', MessagesApiKeys.HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER)
  .build();

export const requestMessagesApi = createRequestApi(endpoints);

export const restApiMessagesHooks = RestApiHooks.initHooks(requestMessagesApi);
