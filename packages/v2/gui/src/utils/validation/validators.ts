import dayjs from 'dayjs';
import { saksnummerOrFodselsnummerPattern } from './regexes';
import { validateTextCharacters } from './validateTextCharacters';
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

export const hasValidText = (text: string) => {
  if (text === undefined || text === null || text === '') {
    return undefined;
  }
  const { invalidCharacters } = validateTextCharacters(text);
  if (invalidCharacters && invalidCharacters.length > 0) {
    const invalidCharacterString: string = invalidCharacters
      .map(invalidChar => invalidChar.replace(/\t/g, 'Tabulatortegn'))
      .join('');
    return `Følgende tegn er ikke tillatt: ${invalidCharacterString}`;
  }
  return undefined;
};
