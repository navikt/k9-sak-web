import getAxiosHttpClientApi from './src/axios/getAxiosHttpClientApi';
import AbstractRequestApi from './src/requestApi/AbstractRequestApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestApiMock from './src/requestApi/RequestApiMock';
import RequestConfig from './src/RequestConfig';

export { default as AbstractRequestApi } from './src/requestApi/AbstractRequestApi';
export { default as apiPaths } from './src/requestApi/apiPaths';
export type { default as ErrorType } from './src/requestApi/error/errorTsType';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';
export type { default as Link } from './src/requestApi/LinkTsType';
export { default as RequestApi } from './src/requestApi/RequestApi';
export { REQUEST_POLLING_CANCELLED } from './src/requestApi/RequestRunner';
export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';

let isUnitTestModeOn = false;

export const switchOnTestMode = () => {
  isUnitTestModeOn = true;
};

export const createRequestApi = (configs: RequestConfig[]): AbstractRequestApi =>
  isUnitTestModeOn ? new RequestApiMock() : new RequestApi(getAxiosHttpClientApi(), configs);
