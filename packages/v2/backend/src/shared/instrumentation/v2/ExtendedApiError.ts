import { isObject } from '../../../typecheck/isObject.js';
import { isString } from '../../../typecheck/isString.js';

export type NavCallid = `CallId_${string}`;

export const isNavCallid = (maybe: string): maybe is NavCallid => maybe.startsWith('CallId_');

export class ExtendedApiError extends Error {
  public navCallid: NavCallid | null;
  public readonly errorId: number = Math.floor(Math.random() * 1000000000);
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly error: string | object;
  public readonly body: string | object;
  public readonly request: Request;

  constructor(req: Request, resp: Response, error: string | object, navCallid: string | null) {
    const errBody = typeof error === 'string' ? error : JSON.stringify(error);
    const msg = `Forespørsel til ${req.url} feilet (${resp.status}): ${errBody}`;
    super(msg);
    this.url = req.url;
    this.status = resp.status;
    this.statusText = resp.statusText;
    this.error = error;
    this.body = error;
    this.request = req;

    this.name = this.constructor.name;
    if (navCallid !== null && isNavCallid(navCallid)) {
      this.navCallid = navCallid;
    } else {
      this.navCallid = null;
    }
  }

  public get isBadRequest(): boolean {
    return this.status === 400;
  }

  public get isUnauthorized(): boolean {
    return this.status === 401;
  }

  public get isForbidden(): boolean {
    return this.status === 403;
  }

  public get isNotFound(): boolean {
    return this.status === 404;
  }

  public get bodyFeilmelding(): string | null {
    const { body } = this;
    if (isObject(body) && 'feilmelding' in body && isString(body.feilmelding)) {
      return body.feilmelding;
    }
    return null;
  }

  public override toString(): string {
    let feilmelding = this.bodyFeilmelding;
    if (feilmelding !== null) {
      feilmelding = ' - ' + feilmelding;
    }
    return `${super.name} (${this.url}): ${super.message} ${feilmelding}`;
  }

  /**
   * Returner gitt ukjente error instans som ExtendedApiError viss den er det. Viss gitt error instans har cause satt,
   * søk rekursivt etter ExtendedApiError i den. Returnerer null viss ingen ExtendedApiError instans finnes.
   */
  static findInError(error: unknown): ExtendedApiError | null {
    if (error instanceof ExtendedApiError) {
      return error;
    }
    if (error instanceof Error) {
      const { cause } = error;
      if (cause != null) {
        return ExtendedApiError.findInError(cause);
      }
    }
    return null;
  }
}
