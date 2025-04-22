import { CancelablePromise, type OpenAPIConfig } from '@navikt/ung-sak-typescript-client';
import type { ApiRequestOptions } from '@navikt/ung-sak-typescript-client/core/ApiRequestOptions.js';
import { FetchHttpRequest } from '@navikt/ung-sak-typescript-client/core/FetchHttpRequest.js';
import { requestWithExtendedErrorHandler } from './requestWithExtendedErrorHandler.js';

export class UngSakHttpRequest extends FetchHttpRequest {
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
