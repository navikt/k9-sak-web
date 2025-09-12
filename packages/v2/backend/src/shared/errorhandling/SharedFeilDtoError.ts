import { ExtendedApiError } from './ExtendedApiError.js';
import { type FeilDtoUnion, feilTypeUnion, isFeilDtoUnion } from './FeilDtoUnion.js';

export abstract class SharedFeilDtoError extends ExtendedApiError {
  #feilDto: FeilDtoUnion | undefined | null;

  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    super(req, resp, error, navCallid);
    this.name = SharedFeilDtoError.name;
  }

  public get errorData(): FeilDtoUnion | null {
    if (this.#feilDto === undefined) {
      this.#feilDto = isFeilDtoUnion(this.body) ? this.body : null;
    }
    return this.#feilDto;
  }

  public get erValideringsfeil(): boolean {
    return this.errorData?.type === feilTypeUnion.VALIDERINGS_FEIL;
  }

  public get erManglerTilgangFeil(): boolean {
    return this.errorData?.type === feilTypeUnion.MANGLER_TILGANG_FEIL;
  }

  public get erTomtResultatFeil(): boolean {
    return this.errorData?.type === feilTypeUnion.TOMT_RESULTAT_FEIL;
  }

  public get erBehandlingEndretFeil(): boolean {
    return this.errorData?.type === feilTypeUnion.MANGLER_TILGANG_FEIL;
  }

  public get erGenerellFeil(): boolean {
    return this.errorData?.type === feilTypeUnion.GENERELL_FEIL;
  }
}
