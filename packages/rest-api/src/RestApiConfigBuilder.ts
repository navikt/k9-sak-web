import RequestAdditionalConfig from './RequestAdditionalConfigTsType';
import RequestConfig from './RequestConfig';

/**
 * RestApiConfigBuilder
 *
 * Brukes for å sette opp server-endepunkter.
 */
class RestApiConfigBuilder {
  endpoints: RequestConfig[] = [];

  withGet(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withGetMethod());
    return this;
  }

  withAsyncGet(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withGetAsyncMethod());
    return this;
  }

  withPost(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withPostMethod());
    return this;
  }

  withAsyncPost(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withPostAsyncMethod());
    return this;
  }

  withPut(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withPutMethod());
    return this;
  }

  withAsyncPut(path: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, path, config).withPutAsyncMethod());
    return this;
  }

  withRel(rel: string, name: string, config?: RequestAdditionalConfig): this {
    this.endpoints.push(new RequestConfig(name, undefined, config).withRel(rel));
    return this;
  }

  build(): RequestConfig[] {
    return this.endpoints;
  }
}

export default RestApiConfigBuilder;
