import { describe, expect, it } from 'vitest';
import {
  navnMedLatinskeBokstaverForUngTilbake,
  navnUtenTallForK9Tilbake,
  normaliserBegrunnelse,
  organisasjonsnummerMedNiSiffer,
} from './registrerVergeValidering.js';

describe('navnUtenTallForK9Tilbake', () => {
  it.each(['Ola Nordmann', "O'Neil-Ås", 'Ørjan Æsøy', 'Zoë Müller'])('godtar %s', navn => {
    expect(navnUtenTallForK9Tilbake(navn)).toBeUndefined();
  });

  it.each(['Ola 2', 'Advokat 1 AS'])('avviser tall i %s', navn => {
    expect(navnUtenTallForK9Tilbake(navn)).toBe('Navn kan ikke inneholde tall');
  });
});

describe('navnMedLatinskeBokstaverForUngTilbake', () => {
  it.each(['Ola Nordmann 2', "O'Neil-Ås", 'Ørjan Æsøy', 'Zoë Müller', 'Ola\u00A0Nordmann'])('godtar %s', navn => {
    expect(navnMedLatinskeBokstaverForUngTilbake(navn)).toBeUndefined();
  });

  it.each([
    ['kyrillisk', 'Иван'],
    ['gresk', 'Ελένη'],
    ['latinsk bokstav uten store/små (ª)', 'Maria ª'],
    ['linjeskilletegn', 'Ola\u2028Nordmann'],
  ])('avviser %s', (_beskrivelse, navn) => {
    expect(navnMedLatinskeBokstaverForUngTilbake(navn)).toBe('Navn kan bare inneholde latinske bokstaver');
  });
});

describe('organisasjonsnummerMedNiSiffer', () => {
  it('godtar ni siffer', () => {
    expect(organisasjonsnummerMedNiSiffer('999999999')).toBeUndefined();
  });

  it.each(['1234567e1', '12345678', ' 999999999', '١٢٣٤٥٦٧٨٩'])('avviser %s', organisasjonsnummer => {
    expect(organisasjonsnummerMedNiSiffer(organisasjonsnummer)).toBe('Organisasjonsnummer må være 9 siffer');
  });
});

describe('normaliserBegrunnelse', () => {
  it('gjør Unicode-mellomrom til vanlige mellomrom og trimmer', () => {
    expect(normaliserBegrunnelse(' A\u00A0B\u202FC\u3000D ')).toBe('A B C D');
  });

  it('gjør linje- og avsnittsskilletegn til linjeskift og beholder vanlige linjeskift', () => {
    expect(normaliserBegrunnelse('A\u2028B\u2029C\nD')).toBe('A\nB\nC\nD');
  });

  it('gir tom tekst for bare mellomrom og for tømt felt', () => {
    expect(normaliserBegrunnelse('\u00A0 \u3000')).toBe('');
    expect(normaliserBegrunnelse(null)).toBe('');
  });
});
