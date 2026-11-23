import { invalidTextRegex } from './regexes.js';

export interface InvalidTextResult {
  readonly ok?: never;
  readonly invalidCharacters: string[];
}

export interface ValidTextResult {
  readonly ok: true;
  readonly invalidCharacters?: never;
}

export const validateTextCharacters = (
  inp: string,
  regex: RegExp = invalidTextRegex,
): ValidTextResult | InvalidTextResult => {
  const invalidCharacters = inp.match(regex);
  if (invalidCharacters !== null) {
    return { invalidCharacters };
  }
  return { ok: true };
};

// Usynlige tegn (kontrolltegn o.l.) vises som kodepunkt, slik at saksbehandler kan se hvilket tegn som er ugyldig
export const formatInvalidCharacters = (invalidCharacters: string[]): string =>
  [...new Set(invalidCharacters)]
    .map(char =>
      /\p{C}/u.test(char) ? `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}` : char,
    )
    .join(' ');
