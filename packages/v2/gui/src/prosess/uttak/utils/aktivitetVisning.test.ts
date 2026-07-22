import { describe, expect, it } from 'vitest';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { utledAktivitetVisningsnavn, utledArbeidsgiverNavn } from './aktivitetVisning';

const arbeidsgivere = {
  '123': {
    navn: 'BEDRIFT AS',
    identifikator: '123',
    arbeidsforholdreferanser: [],
  },
} as ArbeidsgiverOversiktDto['arbeidsgivere'];

describe('aktivitetVisning', () => {
  it('viser ikke arbeidsgiverlinje når backend ikke sender identifikator', async () => {
    await expect(utledArbeidsgiverNavn(undefined, arbeidsgivere)).toBeUndefined();
  });

  it('viser aktivitetstype for dagpenger uten arbeidsgiver', async () => {
    await expect(utledAktivitetVisningsnavn('DP', undefined, arbeidsgivere)).toBe('Dagpenger');
  });

  it('viser arbeidsgivernavn for arbeidstaker', async () => {
    await expect(utledAktivitetVisningsnavn('AT', '123', arbeidsgivere)).toBe('BEDRIFT AS (123)');
  });

  it('beholder eksisterende fallback for arbeidstaker uten arbeidsgivernavn', async () => {
    await expect(utledAktivitetVisningsnavn('AT', '999', arbeidsgivere)).toBe('Mangler navn (999)');
  });

  it('viser arbeidsgivernavn også for ikke yrkesaktiv når backend sender identifikator', async () => {
    await expect(utledAktivitetVisningsnavn('IKKE_YRKESAKTIV', '123', arbeidsgivere)).toBe('BEDRIFT AS (123)');
  });
});
