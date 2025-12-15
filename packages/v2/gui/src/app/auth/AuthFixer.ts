import {
  type AuthResult,
  authAbortedResult,
  authSuccessResult,
  authSuccessExceptPopupResult,
} from '@k9-sak-web/backend/shared/auth/AuthFixApi.js';
import { resolveLoginURL, withRedirectTo } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import type { AuthFixConnectedApi } from './AuthFixConnectedApi.js';
import * as Sentry from '@sentry/react';

const intentionalAbortReason = 'promise cleanup';

export class AuthFixer implements AuthFixConnectedApi {
  readonly #authDoneRedirectPath: string;
  readonly #popupClosedCheckInterval: number;
  readonly #id: string;

  constructor(authDoneRedirectPath: string, id: string | null = null, popupClosedCheckInterval: number = 1483) {
    this.#authDoneRedirectPath = authDoneRedirectPath;
    this.#popupClosedCheckInterval = popupClosedCheckInterval;
    this.#id = id ?? `${Math.floor(Math.random() * 10000)}`;
  }

  get popupTarget() {
    return `k9-web-auth-redirect-flow`;
  }

  toString() {
    return `AuthFixer-${this.#id}`;
  }

  protected resolveLoginUrl(response: Response): URL | null {
    return withRedirectTo(resolveLoginURL(response.headers.get('Location')), this.#authDoneRedirectPath);
  }

  private log(level: 'info' | 'debug' | 'warn', txt: string) {
    const prefix = `${this.toString()}: `;
    const msg = `${prefix}${txt}`;
    switch (level) {
      case 'debug':
        console.debug(msg);
        break;
      case 'info':
        Sentry.logger.info(msg);
        console.info(msg);
        break;
      case 'warn':
        Sentry.logger.warn(msg);
        console.warn(msg);
        break;
    }
  }

  protected startNewAuthenticationProcess(response: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    const internalCanceller = new AbortController();
    const authResultPromise = new Promise<AuthResult>((resolve, reject) => {
      try {
        internalCanceller.signal.addEventListener('abort', () => {
          if (internalCanceller.signal.reason === intentionalAbortReason) {
            resolve(authAbortedResult);
          } else {
            reject(new Error(`authentication fixer promise aborted`, { cause: internalCanceller.signal.reason }));
          }
        });
        window.addEventListener(
          'message',
          event => {
            try {
              if (event.origin == window.origin) {
                if (event.data === 'auth done') {
                  const source = event.source;
                  if (source != null && 'close' in source) {
                    this.log('debug', 'autentisering ferdig, lukker popup');
                    source.close();
                    resolve(authSuccessResult);
                  } else {
                    this.log('info', 'Kunne ikke lukke popup vindu. Må gjøres manuelt av bruker.');
                    resolve(authSuccessExceptPopupResult);
                  }
                }
              }
            } catch (err) {
              reject(new Error(`Processing of received auth postMessage failed`, { cause: err }));
            }
          },
          { signal: internalCanceller.signal },
        );
      } catch (e) {
        reject(new Error(`addEventListener for auth postMessage failed`, { cause: e }));
      }
    }).finally(() => {
      // Remove the message event listener when promise is resolved or rejected to avoid leaks.
      internalCanceller.abort(intentionalAbortReason);
    });
    if (abortSignal.aborted) {
      // aborted before starting auth process, cancel the promise and skip opening the popup
      internalCanceller.abort(intentionalAbortReason);
    } else {
      const loginURL = this.resolveLoginUrl(response);
      if (loginURL != null) {
        this.log('debug', `åpner popup`);
        const windowProxy = window.open(loginURL, this.popupTarget, 'height=600,width=800');
        if (windowProxy != null) {
          // Poll to check if the window has been closed without auth being completed
          const intervalId = setInterval(() => {
            if (windowProxy.closed) {
              this.log('info', `autentisering popup vindu ble lukket før autentisering var fullført.`);
              clearInterval(intervalId);
              internalCanceller.abort(intentionalAbortReason);
            }
          }, this.#popupClosedCheckInterval);
          // Avbryt sjekk på om popup har blitt lukka prematurt.
          void authResultPromise.catch().finally(() => {
            this.log('debug', 'stopp polling for popup vindu lukket');
            clearInterval(intervalId);
          });
          abortSignal.addEventListener(
            'abort',
            () => {
              windowProxy.close?.();
              internalCanceller.abort(intentionalAbortReason);
            },
            { signal: internalCanceller.signal },
          );
        } else {
          this.log(
            'warn',
            `autentisering popup window proxy null. Vil ikke kunne ha kontroll med det gjennom prosessen.`,
          );
        }
      } else {
        internalCanceller.abort(new Error(`loginURL ble ikke utledet, kan ikke utføre autentisering med popup`));
      }
    }
    return authResultPromise;
  }

  #authPromise: Promise<AuthResult> | null = null;
  #activeAuthenticateAborter: AbortController | null = null;
  #activeAuthenticateCallers = 0;

  // Sett opp promise som blir resolved (med abort resultat) viss abortSignal blir utløyst.
  private async aborted(abortSignal: AbortSignal): Promise<AuthResult> {
    return new Promise<AuthResult>(resolve => {
      abortSignal.addEventListener(
        'abort',
        () => {
          resolve(authAbortedResult);
        },
        { once: true },
      );
    });
  }

  async authenticate(response: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    this.#activeAuthenticateCallers = this.#activeAuthenticateCallers + 1;
    try {
      if (this.#authPromise == null) {
        this.#activeAuthenticateAborter = new AbortController();
        this.#authPromise = this.startNewAuthenticationProcess(response, this.#activeAuthenticateAborter.signal);
      }

      return await Promise.race([this.#authPromise, this.aborted(abortSignal)]);
    } finally {
      this.#activeAuthenticateCallers = this.#activeAuthenticateCallers - 1;
      if (this.#activeAuthenticateCallers === 0) {
        this.#authPromise = null;
        // Dette er siste aktive kallet til authenticate, så vi kan avbryte pågåande autentiseringsprosess
        this.#activeAuthenticateAborter?.abort();
      }
    }
  }

  get shouldWaitForAuthentication() {
    return this.isAuthenticating;
  }

  get isAuthenticating() {
    return this.#authPromise != null;
  }

  async authenticationDone(abortSignal: AbortSignal) {
    if (this.#authPromise != null) {
      const authDonePromise = this.#authPromise.then(() => {});
      const abortResolver = Promise.withResolvers<void>();
      try {
        abortSignal.addEventListener('abort', () => abortResolver.resolve(), { once: true });
        return await Promise.race([authDonePromise, abortResolver.promise]);
      } catch {
        // Intentionally do nothing here, the caller of authenticate will get the error
        return;
      }
    }
    return;
  }
}
