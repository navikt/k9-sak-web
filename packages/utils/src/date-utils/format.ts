import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import dayjs from 'dayjs';

const prettyDateFormat = 'DD.MM.YYYY';

export function prettifyDate(date: dayjs.Dayjs) {
  return date.format(prettyDateFormat);
}

export function prettifyDateString(dateString: string) {
  const dateObject = initializeDate(dateString);
  return prettifyDate(dateObject);
}
