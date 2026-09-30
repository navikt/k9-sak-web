import { SharedFeilDtoError } from '../../shared/errorhandling/SharedFeilDtoError.js';

export class K9SakApiError extends SharedFeilDtoError {
  constructor(
    req: Request,
    resp: Response | undefined,
    error: string | object,
    navCallid: string | null,
    options?: ErrorOptions,
  ) {
    super(req, resp, error, navCallid, options);
    this.name = K9SakApiError.name;
  }
}
