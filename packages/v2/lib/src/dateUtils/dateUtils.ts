import 'moment/locale/nb';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from './formats';
import initializeDate from './initializeDate';

export const formatDate = (date: string): string => initializeDate(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT);

export const formatPeriod = (fomDate: string, tomDate: string): string =>
  `${formatDate(fomDate)} - ${formatDate(tomDate)}`;
