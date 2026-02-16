import getAxiosHttpClientApi from './src/axios/getAxiosHttpClientApi';
import type RequestConfig from './src/RequestConfig';
import type AbstractRequestApi from './src/requestApi/AbstractRequestApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestApiMock from './src/requestApi/RequestApiMock';

export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';
export { default as AbstractRequestApi } from './src/requestApi/AbstractRequestApi';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';
export type { default as ErrorType } from './src/requestApi/error/errorTsType';
export type { default as Link } from './src/requestApi/LinkTsType';
export { default as RequestApi } from './src/requestApi/RequestApi';
export { REQUEST_POLLING_CANCELLED } from './src/requestApi/RequestRunner';

let isUnitTestModeOn = false;

export const switchOnTestMode = () => {
  isUnitTestModeOn = true;
};

export const createRequestApi = (configs: RequestConfig[]): AbstractRequestApi =>
  isUnitTestModeOn ? new RequestApiMock() : new RequestApi(getAxiosHttpClientApi(), configs);
