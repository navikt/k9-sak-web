import { SharedFeilDtoError } from '../../shared/errorhandling/SharedFeilDtoError.js';

export class K9SakApiError extends SharedFeilDtoError {
  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    super(req, resp, error, navCallid);
    this.name = K9SakApiError.name;
  }
}
