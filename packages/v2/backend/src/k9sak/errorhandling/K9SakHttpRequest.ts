import { FetchHttpRequest } from '@navikt/k9-sak-typescript-client/core/FetchHttpRequest.js';
import type { ApiRequestOptions } from '@navikt/k9-sak-typescript-client/core/ApiRequestOptions.js';
import { CancelablePromise, type OpenAPIConfig } from '@navikt/k9-sak-typescript-client';
import { requestWithExtendedErrorHandler } from './requestWithExtendedErrorHandler.js';

export class K9SakHttpRequest extends FetchHttpRequest {
  constructor(config: OpenAPIConfig) {
    super(config);
  }
  /**
   * Request method
   * @param options The request options from the service
   * @returns CancelablePromise<T>
   * @throws ApiError
   */

  public override request<T>(options: ApiRequestOptions<T>): CancelablePromise<T> {
    return requestWithExtendedErrorHandler(this.config, options);
  }
}
