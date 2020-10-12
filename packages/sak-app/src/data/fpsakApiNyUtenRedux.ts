import { RestApiConfigBuilder, createRequestApi } from '@fpsak-frontend/rest-api-new';
import { getUseRestApi } from '@fpsak-frontend/rest-api-hooks';

export enum FpsakApiKeys {
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
  BEHANDLING_FAMILIE_HENDELSE = 'BEHANDLING_FAMILIE_HENDELSE',
  ANNEN_PART_BEHANDLING = 'ANNEN_PART_BEHANDLING',
}

const CONTEXT_PATH = '';

const endpoints = new RestApiConfigBuilder(CONTEXT_PATH)
  .withRel('soeker-personopplysninger', FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withGet('/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .build();

export const requestApi = createRequestApi(endpoints);

export const useRestApi = getUseRestApi(requestApi);
