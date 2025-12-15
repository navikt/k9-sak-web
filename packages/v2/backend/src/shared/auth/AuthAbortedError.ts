import type { AuthFixApi } from './AuthFixApi.js';

export class AuthAbortedError extends Error {
  #retryURL: URL | null;
  constructor(retryURL: URL | null, authFixer: AuthFixApi) {
    super(`Autentisering ble avbrutt (i ${authFixer.toString()})`);
    this.#retryURL = retryURL;

    // For at instanceof skal fungere
    this.name = this.constructor.name;
  }

  get retryURL() {
    return this.#retryURL;
  }
}
