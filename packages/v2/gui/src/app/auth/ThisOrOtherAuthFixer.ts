import { authAbortedResult, type AuthResult } from '@k9-sak-web/backend/shared/auth/AuthFixApi.js';
import type { AuthFixConnectedApi } from './AuthFixConnectedApi.js';

/**
 * Når fleire backends har ugyldig autentisering samtidig skal kun ein av dei ha aktiv autentiseringsflyt samtidig.
 * ThisOrOtherAuthFixer brukast som eit lag over fleire AuthFixer, slik at kun ein av dei starter samtidig.
 */
export class ThisOrOtherAuthFixer implements AuthFixConnectedApi {
  readonly #thisFixer: AuthFixConnectedApi;
  readonly #otherFixer: AuthFixConnectedApi;

  constructor(thisFixer: AuthFixConnectedApi, otherFixer: AuthFixConnectedApi) {
    this.#thisFixer = thisFixer;
    this.#otherFixer = otherFixer;
  }

  toString() {
    return `ThisOrOtherAuthFixer for (${this.#thisFixer} , ${this.#otherFixer})`;
  }

  async authenticate(failedResponse: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    if (this.#thisFixer.isAuthenticating) {
      return await this.#thisFixer.authenticate(failedResponse, abortSignal);
    } else {
      if (this.#otherFixer.isAuthenticating) {
        await this.#otherFixer.authenticationDone(abortSignal);
        if (abortSignal.aborted) {
          return authAbortedResult;
        }
      }
      return await this.#thisFixer.authenticate(failedResponse, abortSignal);
    }
  }

  async authenticationDone(abortSignal: AbortSignal): Promise<void> {
    await Promise.all([
      this.#thisFixer.authenticationDone(abortSignal),
      this.#otherFixer.authenticationDone(abortSignal),
    ]).then(res => res.every(res => res));
    // A new authentication might have started in this or other while we waited, if so, restart
    if (this.isAuthenticating) {
      return await this.authenticationDone(abortSignal);
    } else {
      return;
    }
  }

  get shouldWaitForAuthentication() {
    return this.#thisFixer.shouldWaitForAuthentication;
  }

  get isAuthenticating(): boolean {
    return this.#thisFixer.isAuthenticating || this.#otherFixer.isAuthenticating;
  }
}

/**
 * Recursively create tree of ThisOrOtherAuthFixerPairs with thisFixer as the top thisFixer
 */
const authPairing = (
  thisFixer: AuthFixConnectedApi,
  otherFixer: AuthFixConnectedApi,
  more: AuthFixConnectedApi[],
): ThisOrOtherAuthFixer => {
  const [nextOtherFixer, ...nextMore] = more;
  if (nextOtherFixer == null) {
    return new ThisOrOtherAuthFixer(thisFixer, otherFixer);
  } else {
    return new ThisOrOtherAuthFixer(thisFixer, authPairing(otherFixer, nextOtherFixer, nextMore));
  }
};

export function sequentialAuthFixerSetup<
  Fixers extends readonly [AuthFixConnectedApi, AuthFixConnectedApi, ...AuthFixConnectedApi[]],
>(...fixers: Fixers): { [K in keyof Fixers]: ThisOrOtherAuthFixer } {
  const ret: ThisOrOtherAuthFixer[] = [];
  for (const thisFixer of fixers) {
    const [otherFixer, ...more] = fixers.filter(fixer => fixer !== thisFixer);
    if (otherFixer != null) {
      ret.push(authPairing(thisFixer, otherFixer, more));
    } else {
      throw new Error(`There must be at least two different auth fixer instances to use sequentialAuthFixerSetup`);
    }
  }
  return ret as { [K in keyof Fixers]: ThisOrOtherAuthFixer };
}
