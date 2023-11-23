import dayjs from 'dayjs';

export const isDayAfter = (d1: dayjs.Dayjs, d2: dayjs.Dayjs) => {
  const dayAfterD1 = d1.add(1, 'day').utc(true).startOf('day');
  const d2Day = d2.utc(true).startOf('day');
  return dayAfterD1.isSame(d2Day);
};

export function isSameOrBefore(date, otherDate) {
  const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];
  const dateInQuestion = dayjs(date, dateFormats).utc(true);
  const formattedOtherDate = dayjs(otherDate, dateFormats).utc(true);
  return dateInQuestion.isBefore(formattedOtherDate) || dateInQuestion.isSame(formattedOtherDate);
}
