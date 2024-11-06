import { ISO_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import moment from 'moment';

export const durationTilTimerMed7ogEnHalvTimesDagsbasis = (delvisFravær: string): number => {
  const antallTimerMedFulleDager = moment.duration(delvisFravær).asHours();
  const resttimer = antallTimerMedFulleDager % 24;
  const heleDager = Math.floor(antallTimerMedFulleDager / 24);

  return heleDager * 7.5 + resttimer;
};

const smittevernsperiodeStartdatoFom = moment('2020-04-20', ISO_DATE_FORMAT);
const smittevernsperiodeSluttdato = moment('2021-09-30', ISO_DATE_FORMAT);

export const periodeErISmittevernsperioden = (periode: string): boolean => {
  const [fom, tom] = periode.split('/');
  const datoErIPerioden = dato =>
    moment(dato, ISO_DATE_FORMAT).isBetween(
      smittevernsperiodeStartdatoFom.subtract(1, 'second'),
      smittevernsperiodeSluttdato.add(1, 'second'),
    );

  return datoErIPerioden(fom) || datoErIPerioden(tom);
};

export const valgValues = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};
