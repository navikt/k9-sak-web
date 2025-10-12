import { describe, expect, it, vi } from 'vitest';
import { type AuthFixApi, type AuthResult, authSuccessResult } from '@k9-sak-web/backend/shared/auth/AuthFixApi.js';
import { ignoreUnusedDeclared } from '../../storybook/mocks/ignoreUnusedDeclared.js';
import { sequentialAuthFixerSetup } from './ThisOrOtherAuthFixer.js';

class FakeAuthFixer implements AuthFixApi {
  #fakeAuthProcess: PromiseWithResolvers<AuthResult> | null = null;

  constructor(readonly name: string) {}

  toString() {
    return this.name;
  }

  authenticate(failedResponse: Response, abortSignal: AbortSignal): Promise<AuthResult> {
    ignoreUnusedDeclared(failedResponse);
    ignoreUnusedDeclared(abortSignal);
    if (this.#fakeAuthProcess == null) {
      this.#fakeAuthProcess = Promise.withResolvers<AuthResult>();
    }
    return this.#fakeAuthProcess.promise;
  }

  get needsAuthentication() {
    return this.isAuthenticating;
  }

  get isAuthenticating() {
    return this.#fakeAuthProcess != null;
  }

  async authenticationDone(abortSignal: AbortSignal): Promise<void> {
    ignoreUnusedDeclared(abortSignal);
    if (this.#fakeAuthProcess == null) {
      return;
    }
    await this.#fakeAuthProcess.promise;
    return;
  }

  resolveAuth(result: AuthResult) {
    if (this.#fakeAuthProcess != null) {
      this.#fakeAuthProcess.resolve(result);
      this.#fakeAuthProcess = null;
    } else {
      throw new Error('Invalid call to resolveAuth');
    }
  }
}

describe('MultiSequentialAuthFixer', () => {
  const response = new Response(null, { status: 401, headers: { location: 'test' } });
  const aborter = new AbortController();
  const fake1 = new FakeAuthFixer('fake1');
  const fake2 = new FakeAuthFixer('fake2');
  const fake3 = new FakeAuthFixer('fake3');
  const [fakeMulti1, fakeMulti2, fakeMulti3] = sequentialAuthFixerSetup(fake1, fake2, fake3);

  it('should wait for other backends when authenticate is called', async () => {
    const backend1Promise1Settled = vi.fn();
    const backend1Promise1 = fakeMulti1.authenticate(response, aborter.signal).finally(backend1Promise1Settled);
    const backend2Promise1Settled = vi.fn();
    const backend2Promise1 = fakeMulti2.authenticate(response, aborter.signal).finally(backend2Promise1Settled);
    const backend2Done1Settled = vi.fn();
    const backend2Done1 = fakeMulti2.authenticationDone(aborter.signal).finally(backend2Done1Settled);
    const backend3Promise1Settled = vi.fn();
    const backend3Promise1 = fakeMulti3.authenticate(response, aborter.signal).finally(backend3Promise1Settled);
    const backend3Done1Settled = vi.fn();
    const backend3Done1 = fakeMulti3.authenticationDone(aborter.signal).finally(backend3Done1Settled);

    expect(fake1.isAuthenticating).toBe(true);
    expect(fake2.isAuthenticating).toBe(false);
    expect(fake3.isAuthenticating).toBe(false);
    expect(backend2Done1Settled).not.toHaveBeenCalled();
    expect(backend3Done1Settled).not.toHaveBeenCalled();

    fake1.resolveAuth(authSuccessResult);
    await expect(backend1Promise1).resolves.toEqual(authSuccessResult);
    expect(backend2Done1Settled).not.toHaveBeenCalled();
    expect(backend3Done1Settled).not.toHaveBeenCalled();

    expect(fake1.isAuthenticating).toBe(false);
    expect(fake2.isAuthenticating).toBe(true);
    expect(fake3.isAuthenticating).toBe(true);

    fake3.resolveAuth(authSuccessResult);
    await expect(backend3Promise1).resolves.toEqual(authSuccessResult);
    expect(backend2Done1Settled).not.toHaveBeenCalled();
    expect(backend3Done1Settled).not.toHaveBeenCalled(); // Because it depends on fake2
    expect(fake1.isAuthenticating).toBe(false);
    expect(fake2.isAuthenticating).toBe(true);
    expect(fake3.isAuthenticating).toBe(false);
    fake2.resolveAuth(authSuccessResult);
    await expect(backend2Promise1).resolves.toEqual(authSuccessResult);
    await expect(backend2Done1).resolves.toEqual(undefined);
    await expect(backend3Done1).resolves.toEqual(undefined);
    expect(backend2Done1Settled).toHaveBeenCalled();
    expect(backend3Done1Settled).toHaveBeenCalled();
    expect(fake1.isAuthenticating).toBe(false);
    expect(fake2.isAuthenticating).toBe(false);
    expect(fake3.isAuthenticating).toBe(false);

    const settledFlag = vi.fn();
    const backend1Promise2 = fakeMulti1.authenticate(response, aborter.signal).finally(settledFlag);
    const backend1Promise3 = fakeMulti1.authenticate(response, aborter.signal).finally(settledFlag);
    const backend3Promise2 = fakeMulti3.authenticate(response, aborter.signal).finally(settledFlag);
    const backend2Promise2 = fakeMulti2.authenticate(response, aborter.signal).finally(settledFlag);
    const backend3Promise3 = fakeMulti3.authenticate(response, aborter.signal).finally(settledFlag);
    const backend1Promise4 = fakeMulti1.authenticate(response, aborter.signal).finally(settledFlag);

    fake1.resolveAuth(authSuccessResult);
    await expect(backend1Promise2).resolves.toEqual(authSuccessResult);
    await expect(backend1Promise3).resolves.toEqual(authSuccessResult);
    await expect(backend1Promise4).resolves.toEqual(authSuccessResult);
    expect(settledFlag).toHaveBeenCalledTimes(3);
    settledFlag.mockClear();
    fake2.resolveAuth(authSuccessResult);
    await expect(backend2Promise2).resolves.toEqual(authSuccessResult);
    expect(settledFlag).toHaveBeenCalledTimes(1);
    settledFlag.mockClear();
    const backend1Promise5 = fakeMulti1.authenticate(response, aborter.signal).finally(settledFlag);
    expect(settledFlag).not.toHaveBeenCalled();
    fake3.resolveAuth(authSuccessResult);
    await expect(backend3Promise2).resolves.toEqual(authSuccessResult);
    await expect(backend3Promise3).resolves.toEqual(authSuccessResult);
    expect(settledFlag).toHaveBeenCalledTimes(2);
    settledFlag.mockClear();
    fake1.resolveAuth(authSuccessResult);
    await expect(backend1Promise5).resolves.toEqual(authSuccessResult);
    expect(settledFlag).toHaveBeenCalledTimes(1);
  });
});
