import { ApiError } from '@navikt/k9-klage-typescript-client';
import type { ApiResult } from '@navikt/k9-sak-typescript-client/core/ApiResult.js';

export type NavCallid = `CallId_${string}`;

export const isNavCallid = (maybe: string): maybe is NavCallid => maybe.startsWith('CallId_');

export class ExtendedApiError extends ApiError {
  public navCallid: NavCallid | null;
  public readonly errorId: number = Math.floor(Math.random() * 1000000000);

  constructor(apiError: ApiError, navCallid: string | null) {
    // Rekonstruer type som opprinneleg vart sendt til ApiError
    const response: ApiResult = {
      url: apiError.url,
      ok: false,
      status: apiError.status,
      statusText: apiError.statusText,
      body: apiError.body,
    };
    super(apiError.request, response, apiError.message);
    this.name = ExtendedApiError.name;
    if (navCallid !== null && isNavCallid(navCallid)) {
      this.navCallid = navCallid;
    } else {
      this.navCallid = null;
    }
  }

  public get isBadRequest(): boolean {
    return this.status === 400;
  }

  public get bodyFeilmelding(): string | null {
    const { body } = this;
    if (body !== undefined) {
      const { feilmelding } = body;
      if (typeof feilmelding === 'string') {
        return feilmelding;
      }
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
}
