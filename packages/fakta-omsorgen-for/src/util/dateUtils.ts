import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function dateFromString(dateString: string): dayjs.Dayjs {
  return dayjs(dateString, dateFormats).utc(true);
}
