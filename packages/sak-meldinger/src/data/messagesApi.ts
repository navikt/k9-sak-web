import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum MessagesApiKeys {
  HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER = 'HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER',
}

const endpoints = new RestApiConfigBuilder()
  .withRel('malinnhold', MessagesApiKeys.HENT_FRITEKSTBREVMALER_TIL_TYPEN_AV_MEDISINSKE_OPPLYSNINGER)
  .build();

export const requestMessagesApi = createRequestApi(endpoints);

export const restApiMessagesHooks = RestApiHooks.initHooks(requestMessagesApi);
