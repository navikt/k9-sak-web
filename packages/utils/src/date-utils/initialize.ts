import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const supportedFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

export default function initializeDate(date: string | Dayjs) {
  return dayjs(date, supportedFormats).utc(true).startOf('day');
}

export const dateToday = () => dayjs().utc(true).startOf('day');
