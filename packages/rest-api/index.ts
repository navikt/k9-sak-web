import getAxiosHttpClientApi from './src/axios/getAxiosHttpClientApi';
import RequestApi from './src/requestApi/RequestApi';
import RequestConfig from './src/RequestConfig';
import AbstractRequestApi from './src/requestApi/AbstractRequestApi';
import RequestApiMock from './src/requestApi/RequestApiMock';

export { default as RequestApi } from './src/requestApi/RequestApi';
export { REQUEST_POLLING_CANCELLED } from './src/requestApi/RequestRunner';
export { default as RestApiConfigBuilder } from './src/RestApiConfigBuilder';
export { default as AbstractRequestApi } from './src/requestApi/AbstractRequestApi';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/requestApi/error/ErrorTypes';
export type { default as ErrorType } from './src/requestApi/error/errorTsType';
export type { default as Link } from './src/requestApi/LinkTsType';
export { default as apiPaths } from './src/requestApi/apiPaths';

let isUnitTestModeOn = false;
export const switchOnTestMode = () => {
  isUnitTestModeOn = true;
};

export const createRequestApi = (configs: RequestConfig[]): AbstractRequestApi =>
  isUnitTestModeOn ? new RequestApiMock() : new RequestApi(getAxiosHttpClientApi(), configs);
