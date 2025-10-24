import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from './formats';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.locale('nb');

const supportedFormats = [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT];

export const initializeDate = (
  date: string | dayjs.Dayjs | Date,
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
