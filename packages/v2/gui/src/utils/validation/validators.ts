import { Dayjs } from 'dayjs';
import { saksnummerOrFodselsnummerPattern } from './regexes';
import { validateTextCharacters } from './validateTextCharacters';
export const isEmpty = (text: string | number | Dayjs | null | undefined) =>
  text === null || text === undefined || text.toString().trim().length === 0;

export const hasValidSaksnummerOrFodselsnummerFormat = (text: string) =>
  isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text) ? null : 'Ugyldig saksnummer eller fødselsnummer';

export const hasValidText = (text: string) => {
  if (text === undefined || text === null || text === '') {
    return undefined;
  }
  const { invalidCharacters } = validateTextCharacters(text);
  if (invalidCharacters && invalidCharacters.length > 0) {
    const invalidCharacterString: string = invalidCharacters
      .map(invalidChar => invalidChar.replace(/[\t]/, 'Tabulatortegn'))
      .join('');
    return `Følgende tegn er ikke tillatt: ${invalidCharacterString}`;
  }
  return undefined;
};
