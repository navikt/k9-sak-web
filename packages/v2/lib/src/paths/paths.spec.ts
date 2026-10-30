import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPathToK9Los, isProd } from './paths.js';

describe('paths', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['k9.intern.dev.nav.no', 'https://k9-los-web.intern.dev.nav.no'],
    ['ung.intern.dev.nav.no', 'https://k9-los-web.intern.dev.nav.no'],
    ['aktivitetspenger.intern.dev.nav.no', 'https://k9-los-web.intern.dev.nav.no/akt'],
    ['k9.intern.nav.no', 'https://k9-los-web.intern.nav.no'],
    ['ung.intern.nav.no', 'https://k9-los-web.intern.nav.no'],
    ['aktivitetspenger.intern.nav.no', 'https://k9-los-web.intern.nav.no/akt'],
  ])('returns the correct LOS URL for %s', (host, expectedUrl) => {
    vi.stubGlobal('location', new URL(`https://${host}/ung/web`));

    expect(getPathToK9Los()).toEqual(expectedUrl);
  });

  it.each(['localhost', 'unknown.nav.no'])('returns null for %s', host => {
    vi.stubGlobal('location', new URL(`https://${host}/ung/web`));

    expect(getPathToK9Los()).toEqual(null);
  });

  describe('isProd', () => {
    it.each(['k9.intern.nav.no', 'ung.intern.nav.no', 'aktivitetspenger.intern.nav.no'])(
      'returnerer true for %s',
      host => {
        vi.stubGlobal('location', new URL(`https://${host}/ung/web`));

        expect(isProd()).toBe(true);
      },
    );

    it.each([
      'k9.intern.dev.nav.no',
      'ung.intern.dev.nav.no',
      'aktivitetspenger.intern.dev.nav.no',
      'localhost',
      'localhost:3000',
      '127.0.0.1',
      '[::1]',
      'unknown.nav.no',
      'k9.intern.nav.no.example.com',
      'k9.intern.nav.no:8080',
    ])('returnerer false for %s', host => {
      vi.stubGlobal('location', new URL(`https://${host}/ung/web`));

      expect(isProd()).toBe(false);
    });
  });
});
