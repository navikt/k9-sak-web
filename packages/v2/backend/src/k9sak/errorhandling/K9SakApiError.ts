import { ExtendedApiError } from '../../shared/instrumentation/ExtendedApiError.js';
import type { ApiError } from '@navikt/k9-sak-typescript-client';
import { isK9SakErrorData, type K9SakErrorData } from './errorData.js';

export class K9SakApiError extends ExtendedApiError {
  constructor(apiError: ApiError, navCallid: string | null) {
    super(apiError, navCallid);
    this.name = K9SakApiError.name;
  }

  public get errorData(): K9SakErrorData | null {
    return isK9SakErrorData(this.body) ? this.body : null;
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
