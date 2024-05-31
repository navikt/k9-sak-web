import { invalidTextRegex } from './regexes.js';

export interface InvalidTextResult {
  readonly ok?: never;
  readonly invalidCharacters: string[];
}

export interface ValidTextResult {
  readonly ok: true;
  readonly invalidCharacters?: never;
}

export const validateTextCharacters = (inp: string): ValidTextResult | InvalidTextResult => {
  const invalidCharacters = inp.match(invalidTextRegex);
  if (invalidCharacters !== null) {
    return { invalidCharacters };
  }
  return { ok: true };
};
