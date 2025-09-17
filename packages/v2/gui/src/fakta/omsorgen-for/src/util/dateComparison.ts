import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const isDayAfter = (d1: string, d2: string) => {
  const day1 = initializeDate(d1);
  const day2 = initializeDate(d2);
  const dayAfterD1 = day1.add(1, 'day').utc(true).startOf('day');
  const d2Day = day2.utc(true).startOf('day');
  return dayAfterD1.isSame(d2Day);
};

export function isSameOrBefore(date: dayjs.Dayjs | string, otherDate: dayjs.Dayjs | string) {
  const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];
  const dateInQuestion = dayjs(date, dateFormats).utc(true);
  const formattedOtherDate = dayjs(otherDate, dateFormats).utc(true);
  return dateInQuestion.isBefore(formattedOtherDate) || dateInQuestion.isSame(formattedOtherDate);
}
