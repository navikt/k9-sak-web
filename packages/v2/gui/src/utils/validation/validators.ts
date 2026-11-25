import dayjs from 'dayjs';
import { invalidTextRegex, legacyInvalidTextRegex, saksnummerOrFodselsnummerPattern } from './regexes.js';
import { formatInvalidCharacters, validateTextCharacters } from './validateTextCharacters.js';
export const isEmpty = (text: string | number | dayjs.Dayjs | null | undefined) =>
  text === null || text === undefined || text.toString().trim().length === 0;

export const hasValidSaksnummerOrFodselsnummerFormat = (text: string) =>
  isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text) ? null : 'Ugyldig saksnummer eller fødselsnummer';

export const dateBefore = (latest: string, errorMessage: string) => (value: string | undefined) =>
  value && !dayjs(value).isBefore(dayjs(latest), 'day') ? errorMessage : undefined;

export const dateIsNotWeekend = (value: string | undefined) => {
  if (!value || !dayjs(value).isValid()) {
    return undefined;
  }

  return dayjs(value).day() === 0 || dayjs(value).day() === 6 ? 'Dato kan ikke være en helgedag' : undefined;
};

const validateText = (text: string, regex: RegExp) => {
  if (text === undefined || text === null || text === '') {
    return undefined;
  }
  const { invalidCharacters } = validateTextCharacters(text, regex);
  if (invalidCharacters) {
    return `Følgende tegn er ikke tillatt: ${formatInvalidCharacters(invalidCharacters)}`;
  }
  return undefined;
};

export const hasValidText = (text: string) => validateText(text, invalidTextRegex);

/**
 * @deprecated Bruker legacyInvalidTextRegex fordi backend for kallstedene ennå ikke validerer etter ADR-regelen.
 * Bytt til hasValidText når backend er oppdatert, se legacyInvalidTextRegex i regexes.ts.
 */
export const hasValidTextLegacy = (text: string) => validateText(text, legacyInvalidTextRegex);
