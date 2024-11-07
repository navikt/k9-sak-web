import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from './formats';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

const supportedFormats = [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT];

export const initializeDate = (
  date: string | Dayjs | Date,
  customFormat?: string,
  strict?: boolean,
  keepHoursAndMinutes?: boolean,
) => {
  if (keepHoursAndMinutes) {
    return dayjs(date).utc(true);
  }
  return dayjs(date, customFormat || supportedFormats, strict)
    .utc(true)
    .startOf('day');
};

export const dateToday = () => dayjs().utc(true).startOf('day');
