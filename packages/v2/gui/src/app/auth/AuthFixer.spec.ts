import {
  type AuthResult,
  authAbortedResult,
  authDeniedResult,
  authSuccessResult,
} from '@k9-sak-web/backend/shared/auth/AuthFixApi.js';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { ignoreUnusedDeclared } from '../../storybook/mocks/ignoreUnusedDeclared.js';
import { delay } from '../../utils/delay.js';
import { AuthFixer } from './AuthFixer.js';
import { WaitsForOthersAuthFixer } from './WaitsForOthersAuthFixer.js';

class FakeAuthFixer extends AuthFixer {
  #fakeAuthProcess: PromiseWithResolvers<AuthResult> | null = null;
  #fakeAuthProcessSettled = false;

  constructor() {
    super('#test');
  }

  protected override startNewAuthenticationProcess(response: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    ignoreUnusedDeclared(response);
    if (this.#fakeAuthProcess == null || this.#fakeAuthProcessSettled) {
      const fakeAuthProcess = Promise.withResolvers<AuthResult>();
      // Allways set the settled flag when the fake auth process completes
      void fakeAuthProcess.promise
        .catch(() => null) // Need dummy catch to avoid uncaught rejections being reported when fake auth is failed
        .finally(() => {
          this.#fakeAuthProcessSettled = true;
        });
      abortSignal.addEventListener('abort', () => {
        fakeAuthProcess.resolve(authAbortedResult);
      });
      this.#fakeAuthProcess = fakeAuthProcess;
      this.#fakeAuthProcessSettled = false;
      return this.#fakeAuthProcess.promise;
    } else {
      throw new Error('Testfail. AuthFixer should never start new auth process before previous is finished');
    }
  }

  private get fakeAuthProcess() {
    if (this.#fakeAuthProcess == null) {
      throw new Error('Testfail. you must start fake authentication process with call to authenticate first');
    }
    return this.#fakeAuthProcess;
  }

  public fakeAuthResult(result: AuthResult) {
    this.fakeAuthProcess.resolve(result);
  }
  public fakeAuthFail(err: Error) {
    this.fakeAuthProcess.reject(err);
  }
  get fakeAuthPromise() {
    return this.fakeAuthProcess.promise;
  }
}

const abortedAuthResult = authAbortedResult;
const authenticatedAuthResult = authSuccessResult;
const notAuthenticatedAuthResult = authDeniedResult;

describe('AuthFixer api behaviour', () => {
  const fakeResponse1 = new Response(null, { status: 401, headers: { location: '/login' } });

  describe('should follow the api interface description for concurrency', () => {
    describe('for multiple concurrent calls', () => {
      describe('When auth eventually succeeds', () => {
        const aborter = new AbortController();

        let firstAuthenticateCallReturnedPromise: Promise<AuthResult>;
        const firstAuthenticateCallSettledCheck = vi.fn();
        let secondAuthenticateCallReturnedPromise: Promise<AuthResult>;
        const secondAuthenticateCallSettledCheck = vi.fn();

        it('should do each authentication sequentially', async () => {
          const fakeFixerBackend1 = new FakeAuthFixer();
          const fakeFixerBackend2 = new FakeAuthFixer();
          const fakeMultiFixerBackend1 = new WaitsForOthersAuthFixer(fakeFixerBackend1, [fakeFixerBackend2]);
          const fakeMultiFixerBackend2 = new WaitsForOthersAuthFixer(fakeFixerBackend2, [fakeFixerBackend1]);

          firstAuthenticateCallReturnedPromise = fakeMultiFixerBackend1
            .authenticate(fakeResponse1, aborter.signal)
            .finally(firstAuthenticateCallSettledCheck);

          secondAuthenticateCallReturnedPromise = fakeMultiFixerBackend2
            .authenticate(fakeResponse1, aborter.signal)
            .finally(secondAuthenticateCallSettledCheck);
          expect(fakeFixerBackend1.isAuthenticating).toBe(true);
          expect(fakeFixerBackend2.isAuthenticating).toBe(false);
          await delay(15);
          fakeFixerBackend1.fakeAuthResult(authenticatedAuthResult);
          await expect(firstAuthenticateCallReturnedPromise).resolves.toEqual(authenticatedAuthResult);
          await delay(15);
          expect(secondAuthenticateCallSettledCheck).not.toHaveBeenCalled();
          //expect(fakeFixerBackend2.isAuthenticating).toBe(true)
          fakeFixerBackend2.fakeAuthResult(authenticatedAuthResult);
          await expect(secondAuthenticateCallReturnedPromise).resolves.toEqual(authenticatedAuthResult);
          expect(fakeFixerBackend2.isAuthenticating).toBe(false);
        });
      });

      describe('When auth is denied', () => {
        const fakeFixer = new FakeAuthFixer();
        const aborter = new AbortController();

        it('should return negative result for all calls', async () => {
          const firstAuthenticateCallPromise = fakeFixer.authenticate(fakeResponse1, aborter.signal);
          const secondAuthenticateCallPromise = fakeFixer.authenticate(fakeResponse1, aborter.signal);
          const firstAuthenticationDonePromise = fakeFixer.authenticationDone(aborter.signal);
          const secondAuthenticationDoneCallSettledCheck = vi.fn();
          const secondAuthenticationDonePromise = fakeFixer
            .authenticationDone(aborter.signal)
            .finally(secondAuthenticationDoneCallSettledCheck);

          expect(secondAuthenticationDoneCallSettledCheck).not.toHaveBeenCalled();
          fakeFixer.fakeAuthResult(notAuthenticatedAuthResult);

          await expect(firstAuthenticateCallPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(secondAuthenticateCallPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(firstAuthenticationDonePromise).resolves.toEqual(undefined);
          await expect(secondAuthenticationDonePromise).resolves.toEqual(undefined);
          expect(secondAuthenticationDoneCallSettledCheck).toHaveBeenCalled();
          await expect(fakeFixer.fakeAuthPromise).resolves.toEqual(notAuthenticatedAuthResult);
        });
      });

      describe('When auth is aborted', () => {
        describe('by original caller of authenticate', () => {
          const fakeFixer = new FakeAuthFixer();

          const firstAborter = new AbortController();
          const firstAuthenticateCallSettledCheck = vi.fn();
          const firstAuthenticateCallPromise = fakeFixer
            .authenticate(fakeResponse1, firstAborter.signal)
            .finally(firstAuthenticateCallSettledCheck);
          const authPromiseSettledCheck = vi.fn();
          void fakeFixer.fakeAuthPromise.finally(authPromiseSettledCheck);
          const secondAborter = new AbortController();
          const secondAuthenticateCallSettledCheck = vi.fn();
          const secondAuthenticateCallPromise = fakeFixer
            .authenticate(fakeResponse1, secondAborter.signal)
            .finally(secondAuthenticateCallSettledCheck);
          const thirdAborter = new AbortController();
          const firstAuthenticationDoneCallSettledCheck = vi.fn();
          const firstAuthenticationDonePromise = fakeFixer
            .authenticationDone(thirdAborter.signal)
            .finally(firstAuthenticationDoneCallSettledCheck);
          const secondAuthenticationDoneCallSettledCheck = vi.fn();
          const fourthAborter = new AbortController();
          const secondAuthenticationDonePromise = fakeFixer
            .authenticationDone(fourthAborter.signal)
            .finally(secondAuthenticationDoneCallSettledCheck);
          let thirdAuthenticateCallPromise: Promise<AuthResult> | null = null;

          firstAborter.abort('test abort');
          it('should abort the original authenticate call', async () => {
            await expect(firstAuthenticateCallPromise).resolves.toEqual(abortedAuthResult);
          });
          it('should not abort the underlying auth process', async () => {
            expect(authPromiseSettledCheck).not.toHaveBeenCalled();
          });
          it('should not abort the other callers', async () => {
            expect(secondAuthenticateCallSettledCheck).not.toHaveBeenCalled();
            expect(firstAuthenticationDoneCallSettledCheck).not.toHaveBeenCalled();
            expect(secondAuthenticationDoneCallSettledCheck).not.toHaveBeenCalled();
          });
          it('authFixer should still be authenticating', () => {
            expect(fakeFixer.isAuthenticating).toEqual(true);
            // Start a third authenticate call after first is aborted
            const fiftAborter = new AbortController();
            thirdAuthenticateCallPromise = fakeFixer.authenticate(fakeResponse1, fiftAborter.signal);
          });
          it('aborting second authenticateDone call should not affect others', async () => {
            fourthAborter.abort('test abort');
            expect(secondAuthenticateCallSettledCheck).not.toHaveBeenCalled();
            expect(firstAuthenticationDoneCallSettledCheck).not.toHaveBeenCalled();
            await expect(secondAuthenticationDonePromise).resolves.toEqual(undefined);
            expect(secondAuthenticationDoneCallSettledCheck).toHaveBeenCalled();
            expect(authPromiseSettledCheck).not.toHaveBeenCalled();
          });
          it('second authenticate call should still be able to succeed', async () => {
            fakeFixer.fakeAuthResult(authenticatedAuthResult);
            await expect(secondAuthenticateCallPromise).resolves.toEqual(authenticatedAuthResult);
            expect(secondAuthenticateCallSettledCheck).toHaveBeenCalled();
            await expect(secondAuthenticationDonePromise).resolves.toEqual(undefined);
            await expect(firstAuthenticationDonePromise).resolves.toEqual(undefined);
            await expect(fakeFixer.fakeAuthPromise).resolves.toEqual(authenticatedAuthResult);
          });
          it('third authenticate call should also then succeed', async () => {
            await expect(thirdAuthenticateCallPromise).resolves.toEqual(authenticatedAuthResult);
          });
        });

        describe('by all callers of authenticate', () => {
          const fakeFixer = new FakeAuthFixer();

          const firstAborter = new AbortController();
          const firstAuthenticateCallSettledCheck = vi.fn();
          const firstAuthenticateCallPromise = fakeFixer
            .authenticate(fakeResponse1, firstAborter.signal)
            .finally(firstAuthenticateCallSettledCheck);
          const secondAborter = new AbortController();
          const secondAuthenticateCallSettledCheck = vi.fn();
          const secondAuthenticateCallPromise = fakeFixer
            .authenticate(fakeResponse1, secondAborter.signal)
            .finally(secondAuthenticateCallSettledCheck);
          const thirdAborter = new AbortController();
          const firstAuthenticationDoneCallSettledCheck = vi.fn();
          const firstAuthenticationDonePromise = fakeFixer
            .authenticationDone(thirdAborter.signal)
            .finally(firstAuthenticationDoneCallSettledCheck);
          const secondAuthenticationDoneCallSettledCheck = vi.fn();
          const fourthAborter = new AbortController();
          const secondAuthenticationDonePromise = fakeFixer
            .authenticationDone(fourthAborter.signal)
            .finally(secondAuthenticationDoneCallSettledCheck);

          const expectedAbortResult: AuthResult = { isAuthenticated: false, aborted: true };
          firstAborter.abort('test abort');
          secondAborter.abort('test abort');
          it('should abort all calls', async () => {
            await expect(firstAuthenticateCallPromise).resolves.toEqual(expectedAbortResult);
            await expect(secondAuthenticateCallPromise).resolves.toEqual(expectedAbortResult);
            await expect(fakeFixer.fakeAuthPromise).resolves.toEqual(expectedAbortResult);
            await expect(firstAuthenticationDonePromise).resolves.toEqual(undefined);
            await expect(secondAuthenticationDonePromise).resolves.toEqual(undefined);
          });
        });
      });
    });

    describe('for multiple sequential calls', () => {
      describe('to the same backend', () => {
        it('two independent authenticate call should complete', async () => {
          const fakeFixer = new FakeAuthFixer();
          const firstAuthenticateCallPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          const firstAuthPromise = fakeFixer.fakeAuthPromise;
          fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(firstAuthenticateCallPromise).resolves.toEqual(authenticatedAuthResult);
          const secondAuthenticateCallPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          const secondAuthPromise = fakeFixer.fakeAuthPromise;
          expect(firstAuthPromise).not.toBe(secondAuthPromise);
          fakeFixer.fakeAuthResult(notAuthenticatedAuthResult);
          await expect(secondAuthenticateCallPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(secondAuthPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(firstAuthPromise).resolves.toEqual(authenticatedAuthResult);
        });
        it('second call should succeed if first fails', async () => {
          const fakeFixer = new FakeAuthFixer();
          const expectedErr = new Error('test auth fail');

          const firstPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthFail(expectedErr);
          await expect(firstPromise).rejects.toThrow(expectedErr);
          await expect(fakeFixer.fakeAuthPromise).rejects.toThrow(expectedErr);

          const secondPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(secondPromise).resolves.toEqual(authenticatedAuthResult);
        });
        it('second call should succeed if first is aborted', async () => {
          const fakeFixer = new FakeAuthFixer();
          const firstAborter = new AbortController();
          const firstPromise = fakeFixer.authenticate(fakeResponse1, firstAborter.signal);
          firstAborter.abort('test abort');
          await expect(firstPromise).resolves.toEqual(abortedAuthResult);
          const secondPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(secondPromise).resolves.toEqual(authenticatedAuthResult);
        });
      });

      describe('to different backends', () => {
        it('two independent authenticate call should complete', async () => {
          const backend1fakeFixer = new FakeAuthFixer();
          const firstAuthenticateCallPromise = backend1fakeFixer.authenticate(
            fakeResponse1,
            new AbortController().signal,
          );
          const firstAuthPromise = backend1fakeFixer.fakeAuthPromise;
          backend1fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(firstAuthenticateCallPromise).resolves.toEqual(authenticatedAuthResult);
          const secondAuthenticateCallPromise = backend1fakeFixer.authenticate(
            fakeResponse1,
            new AbortController().signal,
          );
          const secondAuthPromise = backend1fakeFixer.fakeAuthPromise;
          expect(firstAuthPromise).not.toBe(secondAuthPromise);
          backend1fakeFixer.fakeAuthResult(notAuthenticatedAuthResult);
          await expect(secondAuthenticateCallPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(secondAuthPromise).resolves.toEqual(notAuthenticatedAuthResult);
          await expect(firstAuthPromise).resolves.toEqual(authenticatedAuthResult);
        });
        it('second call should succeed if first fails', async () => {
          const fakeFixer = new FakeAuthFixer();
          const expectedErr = new Error('test auth fail');

          const firstPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthFail(expectedErr);
          await expect(firstPromise).rejects.toThrow(expectedErr);
          await expect(fakeFixer.fakeAuthPromise).rejects.toThrow(expectedErr);

          const secondPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(secondPromise).resolves.toEqual(authenticatedAuthResult);
        });

        it('second call should succeed if first is aborted', async () => {
          const fakeFixer = new FakeAuthFixer();
          const firstAborter = new AbortController();
          const firstPromise = fakeFixer.authenticate(fakeResponse1, firstAborter.signal);
          firstAborter.abort('test abort');
          await expect(firstPromise).resolves.toEqual(abortedAuthResult);
          const secondPromise = fakeFixer.authenticate(fakeResponse1, new AbortController().signal);
          fakeFixer.fakeAuthResult(authenticatedAuthResult);
          await expect(secondPromise).resolves.toEqual(authenticatedAuthResult);
        });
      });
    });
  });
});

describe('AuthFixer process behaviour', () => {
  // Må overskrive resolveLoginUrl for testing pga at URL implementasjon i jsdom ikkje er kompatibel med nettlesar sin.
  // Kan fjerne denne viss vi bytter til happy-dom eller anna køyremiljø for test.
  class TstAuthFixer extends AuthFixer {
    protected override resolveLoginUrl(response: Response): URL | null {
      ignoreUnusedDeclared(response);
      return new URL('https://example.com/login');
    }
  }
  const fixer = new TstAuthFixer('/after/redir', null, 10);
  const response = new Response(null, {
    status: 401,
    headers: {
      Location: 'https://example.com/login',
    },
  });

  let interceptedListener: EventListener | null = null;
  const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((type, listener) => {
    if (type == 'message' && typeof listener === 'function') {
      interceptedListener = listener as EventListener;
    }
  });
  afterAll(() => {
    windowAddEventListenerSpy.mockRestore();
  });
  describe('authenticate should report', () => {
    it('success when popup window sends auth done message', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue(window);
      try {
        const aborter = new AbortController();
        const authenticatePromise = fixer.authenticate(response, aborter.signal);
        const donePromise = fixer.authenticationDone(new AbortController().signal);
        // Simulate the popup sending auth done message back to listener
        if (interceptedListener != null) {
          // @ts-expect-error Typescript fails to see that this is correct
          interceptedListener({ origin: window.origin, data: 'auth done', source: { close: () => undefined } });
        }

        await expect(donePromise).resolves.toEqual(undefined);
        await expect(authenticatePromise).resolves.toEqual(authenticatedAuthResult);
      } finally {
        windowOpenSpy.mockRestore();
      }
    });

    it('aborted if popup window is closed before auth is done', async () => {
      const mockedOpen = vi
        .spyOn(window, 'open')
        .mockReturnValue({ closed: true, close: undefined } as unknown as WindowProxy);
      try {
        const authenticatePromise = fixer.authenticate(response, new AbortController().signal);
        const donePromise = fixer.authenticationDone(new AbortController().signal);
        await expect(authenticatePromise).resolves.toEqual(abortedAuthResult);
        await expect(donePromise).resolves.toEqual(undefined);
      } finally {
        mockedOpen.mockRestore();
      }
    });

    it('aborted and close popup when abortsignal of last pending authenticate is sent before done', async () => {
      const windowCloseSpy = vi.fn();
      const mockedOpen = vi
        .spyOn(window, 'open')
        .mockReturnValue({ closed: false, close: windowCloseSpy } as unknown as WindowProxy);
      try {
        const aborter1 = new AbortController();
        const authenticatePromise1 = fixer.authenticate(response, aborter1.signal);
        const aborter2 = new AbortController();
        const authenticatePromise2 = fixer.authenticate(response, aborter2.signal);
        aborter1.abort();
        await expect(authenticatePromise1).resolves.toEqual(abortedAuthResult);
        expect(windowCloseSpy).not.toHaveBeenCalled();
        aborter2.abort();
        await expect(authenticatePromise2).resolves.toEqual(abortedAuthResult);
        expect(windowCloseSpy).toHaveBeenCalled();
      } finally {
        mockedOpen.mockRestore();
      }
    });
  });
});
