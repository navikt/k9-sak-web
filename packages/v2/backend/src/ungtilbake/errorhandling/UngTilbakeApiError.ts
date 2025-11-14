import { SharedFeilDtoError } from '../../shared/errorhandling/SharedFeilDtoError.js';

export class UngTilbakeApiError extends SharedFeilDtoError {
  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    super(req, resp, error, navCallid);
    this.name = UngTilbakeApiError.name;
  }
}
