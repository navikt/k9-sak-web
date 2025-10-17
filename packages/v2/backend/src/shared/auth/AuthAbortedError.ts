export class AuthAbortedError extends Error {
  #retryURL: URL | null;
  constructor(retryURL: URL | null) {
    super(`Autentisering ble avbrutt`);
    this.#retryURL = retryURL;

    // For at instanceof skal fungere
    this.name = this.constructor.name;
  }

  get retryURL() {
    return this.#retryURL;
  }
}
