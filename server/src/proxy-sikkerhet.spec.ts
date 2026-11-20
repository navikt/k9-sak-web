import { describe, expect, it } from 'vitest';
import { erInnenforPrefiks, fjernLegitimasjon, lagLoginLocation, normalisertSti } from './proxy-sikkerhet.js';

describe('erInnenforPrefiks', () => {
  it('godtar vanlig sti under prefikset', () => {
    expect(erInnenforPrefiks('/k9/sak/api/fagsak', '/k9/sak')).toBe(true);
  });

  it('godtar .. som blir værende under prefikset', () => {
    expect(erInnenforPrefiks('/k9/sak/api/a/%2e%2e/b', '/k9/sak')).toBe(true);
  });

  it.each([
    ['/k9/sak/%2e%2e/%2e%2e/internal/health', '/k9/sak'],
    ['/k9/sak/../../internal/health', '/k9/sak'],
    ['/k9/formidling/dokumentdata/%2e%2e/%2e%2e/sak/api/x', '/k9/formidling/dokumentdata'],
  ])('avviser %s som går ut av %s', (url, prefiks) => {
    expect(erInnenforPrefiks(url, prefiks)).toBe(false);
  });
});

describe('normalisertSti', () => {
  it('fjerner query', () => {
    expect(normalisertSti('/k9/sak/api/aktoer-info?aktoerId=123')).toBe('/k9/sak/api/aktoer-info');
  });
});

describe('lagLoginLocation', () => {
  it('koder originalUrl slik at den ikke kan legge til egne parametere', () => {
    const originalUrl = '/k9/sak/api/x?a=1&original=https://evil.example';
    const location = new URL(lagLoginLocation('/k9/sak/resource/login', originalUrl), 'http://localhost');
    expect(location.searchParams.getAll('original')).toEqual([originalUrl]);
  });
});

describe('fjernLegitimasjon', () => {
  it('fjerner cookie og authorization, men beholder andre headere', () => {
    const headers = { cookie: 'ID_token=x', authorization: 'Bearer x', 'content-type': 'application/json' };
    fjernLegitimasjon(headers);
    expect(headers).toEqual({ 'content-type': 'application/json' });
  });
});
