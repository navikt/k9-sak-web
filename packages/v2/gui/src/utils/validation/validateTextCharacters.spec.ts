import { describe, expect, it } from 'vitest';
import { legacyInvalidTextRegex } from './regexes.js';
import { formatInvalidCharacters, validateTextCharacters } from './validateTextCharacters.js';

describe('validateTextCharacters', () => {
  it('godtar [ og ] med ADR-regelen', () => {
    expect(validateTextCharacters('Hei [navn]')).toEqual({ ok: true });
  });

  it('avviser [ og ] med legacy-regelen', () => {
    expect(validateTextCharacters('Hei [navn]', legacyInvalidTextRegex)).toEqual({ invalidCharacters: ['[', ']'] });
  });
});

describe('formatInvalidCharacters', () => {
  it('viser synlige tegn som de er og usynlige som kodepunkt, uten duplikater', () => {
    expect(formatInvalidCharacters(['[', ']', '\u200B', '[', '\u0000'])).toBe('[ ] U+200B U+0000');
  });
});
