import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

export const formatDate = (date: string): string => moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT);

export const durationTilTimerMed7ogEnHalvTimesDagsbasis = (delvisFravær: string): number => {
  const antallTimerMedFulleDager = moment.duration(delvisFravær).asHours();
  const resttimer = antallTimerMedFulleDager % 24;
  const heleDager = Math.floor(antallTimerMedFulleDager / 24);

  return heleDager * 7.5 + resttimer;
};

const koronaStartdatoFom = moment('2020-03-13', ISO_DATE_FORMAT);
const koronaSluttdatoTom = moment('2020-06-30', ISO_DATE_FORMAT);
const smittevernsperiodeStartdatoFom = moment('2020-04-20', ISO_DATE_FORMAT);
const smittevernsperiodeSluttdato = moment('2020-12-31', ISO_DATE_FORMAT);

export const periodeErIKoronaperioden = (periode: string): boolean => {
  const [fom, tom] = periode.split('/');
  const datoErIPerioden = dato =>
    moment(dato, ISO_DATE_FORMAT).isBetween(
      koronaStartdatoFom.subtract(1, 'second'),
      koronaSluttdatoTom.add(1, 'second'),
    );

  return datoErIPerioden(fom) || datoErIPerioden(tom);
};

export const periodeErISmittevernsperioden = (periode: string): boolean => {
  const [fom, tom] = periode.split('/');
  const datoErIPerioden = dato =>
    moment(dato, ISO_DATE_FORMAT).isBetween(
      smittevernsperiodeStartdatoFom.subtract(1, 'second'),
      smittevernsperiodeSluttdato.add(1, 'second'),
    );

  return datoErIPerioden(fom) || datoErIPerioden(tom);
};
