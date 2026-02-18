import { tekstTilBoolean } from './stringUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function valideringsFunksjoner(getValues, prop: string) {
  const erDatoFyltUt = dato => {
    if (!tekstTilBoolean(getValues()[prop])) return true;
    return dato.toLowerCase() !== 'dd.mm.åååå' && dato !== '';
  };

  /**
   * @param datoSting DD.MM.YYYY
   * @returns boolean
   */
  const erDatoSisteDagenIÅret = (datoSting: string) => {
    const dato = dayjs.tz(datoSting, 'DD.MM.YYYY', 'Europe/Oslo');
    return dato.isSame(dato.endOf('year'), 'day');
  };

  const erDatoGyldig = dato => {
    if (!tekstTilBoolean(getValues()[prop])) return true;
    const år = parseInt(dato.substr(0, 4), 10);
    const måned = parseInt(dato.substr(5, 2), 10) - 1;
    const dag = parseInt(dato.substr(8, 2), 10);
    const parsedDato = new Date(år, måned, dag);

    if (parsedDato.getDate() === dag) return true;
    return false;
  };

  const erDatoIkkeIFremtid = dato => {
    if (!tekstTilBoolean(getValues()[prop])) return true;
    const år = parseInt(dato.substr(0, 4), 10);
    const måned = parseInt(dato.substr(5, 2), 10) - 1;
    const dag = parseInt(dato.substr(8, 2), 10);
    const parsedDato = new Date(år, måned, dag);
    const dagensDato = new Date();

    if (parsedDato > dagensDato) return false;
    return true;
  };

  return {
    erDatoFyltUt,
    erDatoGyldig,
    erDatoSisteDagenIÅret,
    erDatoIkkeIFremtid,
  };
}
