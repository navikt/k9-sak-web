import { Dayjs } from 'dayjs';
import initializeDate from './initialize';

export default function dateSorter(date1: Dayjs, date2: Dayjs) {
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
