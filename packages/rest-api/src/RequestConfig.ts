import type RequestAdditionalConfig from './RequestAdditionalConfigTsType';

export enum RequestType {
  GET = 'GET',
  GET_ASYNC = 'GET_ASYNC',
  POST = 'POST',
  POST_ASYNC = 'POST_ASYNC',
  PUT = 'PUT',
  PUT_ASYNC = 'PUT_ASYNC',
}

/**
 * maxPollingLimit: Maksimum antall ganger en skal forsøke å polle når en venter på ressurs (long polling). Kun aktuell ved metodene som inkluderer "Async".
 */
const defaultConfig = {
  maxPollingLimit: undefined,
  isResponseBlob: false,
};
const formatConfig = (config: RequestAdditionalConfig = {}): RequestAdditionalConfig => ({
  ...defaultConfig,
  ...config,
});

/**
 * RequestConfig
 */
class RequestConfig {
  name: string;

  config?: RequestAdditionalConfig;

  path?: string;

  restMethod?: string = RequestType.GET;

  rel?: string;

  requestPayload?: any;

  constructor(name: string, path?: string, config?: RequestAdditionalConfig) {
    this.name = name;
    this.path = path;
    this.config = formatConfig(config);
  }

  withGetMethod = (): this => {
    this.restMethod = RequestType.GET;
    return this;
  };

  withGetAsyncMethod = (): this => {
    this.restMethod = RequestType.GET_ASYNC;
    return this;
  };

  withPostMethod = (): this => {
    this.restMethod = RequestType.POST;
    return this;
  };

  withPostAsyncMethod = (): this => {
    this.restMethod = RequestType.POST_ASYNC;
    return this;
  };

  withPutMethod = (): this => {
    this.restMethod = RequestType.PUT;
    return this;
  };

  withPutAsyncMethod = (): this => {
    this.restMethod = RequestType.PUT_ASYNC;
    return this;
  };

  withRel = (rel: string): this => {
    this.rel = rel;
    return this;
  };

  withRestMethod = (restMethod: string): this => {
    this.restMethod = restMethod.toUpperCase();
    return this;
  };

  withRequestPayload = (requestPayload?: any): this => {
    this.requestPayload = requestPayload;
    return this;
  };
}

export default RequestConfig;
