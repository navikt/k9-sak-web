import { Dayjs } from 'dayjs';
import { saksnummerOrFodselsnummerPattern } from './regexes';
export const isEmpty = (text: string | number | Dayjs | null | undefined) =>
  text === null || text === undefined || text.toString().trim().length === 0;

export const hasValidSaksnummerOrFodselsnummerFormat = (text: string) =>
  isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text) ? null : 'Ugyldig saksnummer eller fødselsnummer';
