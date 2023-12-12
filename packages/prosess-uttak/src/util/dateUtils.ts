import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Uttaksperioder } from '../types';

const dateFormats = ['YYYY-MM-DD', 'DD.MM.YYYY'];

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

export const prettifyDate = (date: string): string => dayjs(date).utc(true).format('DD.MM.YYYY');

export const beregnDagerTimer = (dur: string): number => Math.round(dayjs.duration(dur).asHours() * 100) / 100;

export function dateFromString(dateString: string): dayjs.Dayjs {
  return dayjs(dateString, dateFormats).utc(true);
}

export const finnTidligsteStartDatoFraUttaksperioder = (uttaksperioder: Uttaksperioder): Date => {
  const startDatoer = Object.keys(uttaksperioder).map(key => dayjs(key.split('/')[0]));
  return new Date(Math.min(...startDatoer.map(date => date.valueOf())));
};

export const finnSisteSluttDatoFraUttaksperioder = (uttaksperioder: Uttaksperioder): Date => {
  const sluttDatoer = Object.keys(uttaksperioder).map(key => dayjs(key.split('/')[1]));
  return new Date(Math.max(...sluttDatoer.map(date => date.valueOf())));
};
