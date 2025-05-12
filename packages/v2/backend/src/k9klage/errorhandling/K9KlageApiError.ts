import { ExtendedApiError } from '../../shared/instrumentation/v2/ExtendedApiError.js';
import { isK9KlageErrorData, type K9KlageErrorData } from './errorData.js';

export class K9KlageApiError extends ExtendedApiError {
  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    super(req, resp, error, navCallid);
    this.name = K9KlageApiError.name;
  }

  public get errorData(): K9KlageErrorData | null {
    return isK9KlageErrorData(this.error) ? this.error : null;
  }

  public get erManglerTilgangFeil(): boolean {
    return this.errorData?.type === 'MANGLER_TILGANG_FEIL';
  }

  public get erTomtResultatFeil(): boolean {
    return this.errorData?.type === 'TOMT_RESULTAT_FEIL';
  }

  public get erBehandlingEndretFeil(): boolean {
    return this.errorData?.type === 'BEHANDLING_ENDRET_FEIL';
  }

  public get erGenerellFeil(): boolean {
    return this.errorData?.type === 'GENERELL_FEIL';
  }
}
