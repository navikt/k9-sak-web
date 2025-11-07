import { type AuthResult } from '@k9-sak-web/backend/shared/auth/AuthFixApi.js';
import type { AuthFixConnectedApi } from './AuthFixConnectedApi.js';
import { delay } from '../../utils/delay.js';

/**
 * Når fleire backends har ugyldig autentisering samtidig skal kun ein av dei ha aktiv autentiseringsflyt samtidig.
 * WaitsForOthersAuthfixer brukast som eit lag over fleire AuthFixer, slik at kun ein av dei starter samtidig.
 */
export class WaitsForOthersAuthFixer implements AuthFixConnectedApi {
  readonly #thisFixer: AuthFixConnectedApi;
  readonly #others: AuthFixConnectedApi[];

  constructor(thisFixer: AuthFixConnectedApi, otherFixers: AuthFixConnectedApi[]) {
    this.#thisFixer = thisFixer;
    this.#others = otherFixers;
  }

  private get othersAreAuthenticating() {
    return this.#others.some(fixer => fixer.isAuthenticating);
  }

  private async othersAuthenticationDone(abortSignal: AbortSignal): Promise<void> {
    await Promise.all([this.#others.map(fixer => fixer.authenticationDone(abortSignal))]);
  }

  get isAuthenticating(): boolean {
    return this.#thisFixer.isAuthenticating || this.othersAreAuthenticating;
  }

  async authenticate(failedResponse: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    while (this.othersAreAuthenticating && !abortSignal.aborted) {
      await this.othersAuthenticationDone(abortSignal);
      await delay(2, abortSignal); // yield slik at andre ventende kall kan komme inn. Uten denne blir det startet parallelle autentiseringsflyter.
    }
    return await this.#thisFixer.authenticate(failedResponse, abortSignal);
  }

  async authenticationDone(abortSignal: AbortSignal): Promise<void> {
    await this.othersAuthenticationDone(abortSignal);
    await this.#thisFixer.authenticationDone(abortSignal);
  }

  get shouldWaitForAuthentication(): boolean {
    return this.isAuthenticating;
  }
}

export function sequentialAuthFixerSetup<
  Fixers extends readonly [AuthFixConnectedApi, AuthFixConnectedApi, ...AuthFixConnectedApi[]],
>(...fixers: Fixers): { [K in keyof Fixers]: WaitsForOthersAuthFixer } {
  const ret: WaitsForOthersAuthFixer[] = [];
  for (const thisFixer of fixers) {
    const otherFixers = fixers.filter(fixer => fixer !== thisFixer);
    if (otherFixers.length == 0) {
      throw new Error(`There must be at least two different auth fixer instances to use sequentialAuthFixerSetup`);
    }
    ret.push(new WaitsForOthersAuthFixer(thisFixer, otherFixers));
  }
  return ret as { [K in keyof Fixers]: WaitsForOthersAuthFixer };
}
