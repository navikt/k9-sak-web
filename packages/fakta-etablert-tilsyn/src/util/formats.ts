import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const prettifyDate = (date: string) => dayjs(date).utc(true).format('DD.MM.YYYY');
