import { Dayjs } from 'dayjs';
import initializeDate from './initialize';

const prettyDateFormat = 'DD.MM.YYYY';
const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

export function prettifyDate(date: Dayjs) {
  return date.format(prettyDateFormat);
}

export function prettifyDateString(dateString: string) {
  const dateObject = initializeDate(dateString);
  return prettifyDate(dateObject);
}
