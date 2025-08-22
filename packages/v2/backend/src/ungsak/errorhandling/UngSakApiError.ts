import { ExtendedApiError } from '../../shared/instrumentation/v2/ExtendedApiError.js';
import { isUngSakErrorData, type UngSakErrorData } from './errorData.js';

export class UngSakApiError extends ExtendedApiError {
  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    super(req, resp, error, navCallid);
    this.name = UngSakApiError.name;
  }

  public get errorData(): UngSakErrorData | null {
    return isUngSakErrorData(this.body) ? this.body : null;
  }

  public get erValideringsfeil(): boolean {
    return this.errorData?.type === 'VALIDERINGS_FEIL';
  }

  public get erManglerTilgangFeil(): boolean {
    return this.errorData?.type === 'MANGLER_TILGANG_FEIL';
  }

  public get erTomtResultatFeil(): boolean {
    return this.errorData?.type === 'TOMT_RESULTAT_FEIL';
  }

  public get erBehandlingEndretFeil(): boolean {
    return this.errorData?.type === 'MANGLER_TILGANG_FEIL';
  }

  public get erGenerellFeil(): boolean {
    return this.errorData?.type === 'GENERELL_FEIL';
  }
}
