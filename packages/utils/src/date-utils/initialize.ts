import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isoWeek);

const supportedFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

export default function initializeDate(
  dateString: string,
  customFormat?: string,
  strict?: boolean,
  keepHoursAndMinutes?: boolean,
) {
  if (keepHoursAndMinutes) {
    return dayjs(dateString).utc(true);
  }
  return dayjs(dateString, customFormat || supportedFormats, strict)
    .utc(true)
    .startOf('day');
}

export const dateToday = () => dayjs().utc(true).startOf('day');
