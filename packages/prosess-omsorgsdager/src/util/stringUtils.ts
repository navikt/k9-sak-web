import dayjs from 'dayjs';
import TilgjengeligÅrOption from '../types/TilgjengeligeÅrOptions';

export const tekstTilBoolean = (string: string) => {
  if (string !== undefined && string !== null && string.length > 0) {
    return string.toLowerCase() === 'true';
  }
  return false;
};

export const booleanTilTekst = (bool: boolean) => (bool ? 'true' : 'false');

export const safeJSONParse = str => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const formatereDato = (dato: string): string => dato.replaceAll('-', '.');

export const formatereDatoTilLesemodus = (dato: string): string => dayjs(dato).format('DD.MM.YYYY');

export const utledTilgjengeligeÅr = (fraDato: string): TilgjengeligÅrOption[] => {
  const nåværendeÅr = dayjs().year();
  const årFraDato = dayjs(fraDato).year();
  const tidligsteMuligeÅr = årFraDato > nåværendeÅr ? årFraDato : nåværendeÅr - 1;
  const år: TilgjengeligÅrOption[] = [{ value: '0', title: 'Dato for opphør', disabled: true }];
  for (let i = tidligsteMuligeÅr; i <= dayjs().year() + 19; i += 1) {
    år.push({ value: i.toString(), title: `31.12.${i.toString()}`, disabled: false });
  }
  return år;
};
