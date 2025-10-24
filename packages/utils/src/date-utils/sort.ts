import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import dayjs from 'dayjs';

export default function dateSorter(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
  if (date1.isBefore(date2)) {
    return -1;
  }
  if (date2.isBefore(date1)) {
    return 1;
  }
  return 0;
}

export function dateStringSorter(date1: string, date2: string) {
  const date1AsDayjs = initializeDate(date1);
  const date2AsDayjs = initializeDate(date2);
  return dateSorter(date1AsDayjs, date2AsDayjs);
}
