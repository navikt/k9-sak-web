import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const isDayAfter = (d1: dayjs.Dayjs, d2: dayjs.Dayjs) => {
  const dayAfterD1 = d1.add(1, 'day').utc(true).startOf('day');
  const d2Day = d2.utc(true).startOf('day');
  return dayAfterD1.isSame(d2Day);
};

export function isSameOrBefore(date: dayjs.Dayjs | string, otherDate: dayjs.Dayjs | string) {
  const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];
  const dateInQuestion = dayjs(date, dateFormats).utc(true);
  const formattedOtherDate = dayjs(otherDate, dateFormats).utc(true);
  return dateInQuestion.isBefore(formattedOtherDate) || dateInQuestion.isSame(formattedOtherDate);
}
