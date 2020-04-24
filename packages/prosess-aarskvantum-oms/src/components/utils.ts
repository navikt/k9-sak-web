import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

export const storForbokstav = (string: string) => string.charAt(0).toUpperCase() + string.substr(1);

export const formatDate = (date: string): string => moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT);

export const durationTilTimerMed7ogEnHalvTimesDagsbasis = (delvisFravær: string): number => {
  const antallTimerMedFulleDager = moment.duration(delvisFravær).asHours();
  const resttimer = antallTimerMedFulleDager % 24;
  const heleDager = Math.floor(antallTimerMedFulleDager / 24);

  return heleDager * 7.5 + resttimer;
};
