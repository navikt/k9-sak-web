import { isObject } from '../../typecheck/isObject.js';
import { isString } from '../../typecheck/isString.js';

export type NavCallid = `CallId_${string}`;

export const isNavCallid = (maybe: string): maybe is NavCallid => maybe.startsWith('CallId_');

export class ExtendedApiError extends Error {
  public navCallid: NavCallid | null;
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: string | object;
  public readonly request: Request;
  public readonly location: string | null;

  constructor(req: Request, resp: Response, body: string | object, navCallid: string | null) {
    let msg = `${req.method} Forespørsel til ${req.url} feilet (${resp.status})`;
    const bodyFeilmelding = ExtendedApiError.resolveBodyFeilmelding(body);
    if (bodyFeilmelding != null) {
      msg = `${msg}: ${bodyFeilmelding}`;
    }
    super(msg);
    this.url = req.url;
    this.status = resp.status;
    this.statusText = resp.statusText;
    this.location = resp.headers.get('Location');
    this.body = body;
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

  public get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  private static resolveBodyFeilmelding(body: string | object): string | null {
    if (isObject(body) && 'feilmelding' in body && isString(body.feilmelding)) {
      return body.feilmelding;
    }
    return null;
  }

  public get bodyFeilmelding(): string | null {
    const { body } = this;
    return ExtendedApiError.resolveBodyFeilmelding(body);
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
