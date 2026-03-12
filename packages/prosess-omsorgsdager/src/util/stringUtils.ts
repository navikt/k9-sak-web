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

/**
 * Utleder tilgjengelige år basert på fraDato og eventuelle relative år
 * @param {string} fraDato: Datoen som angir startpunktet for tilgjengelige år.
 * @param {number | undefined} relativtFraÅr: Antall år før fraDato som skal inkluderes (valgfritt).
 * @param {number | undefined} relativtTilÅr: Antall år etter fraDato som skal inkluderes (valgfritt).
 * @param {number | undefined} tidligsteMuligeÅrFørNårværendeÅr: Antall år før nåværende år som skal inkluderes (valgfritt). Dersom fraDato er senere benyttes årstallet for fraDato.
 * @returns En liste av objekter med tilgjengelige år.
 */
export const utledTilgjengeligeÅr = (
  fraDato: string,
  relativtFraÅr?: number | undefined,
  relativtTilÅr: number | undefined = 19,
  tidligsteMuligeÅrFørNårværendeÅr?: number,
): TilgjengeligÅrOption[] => {
  const nåværendeÅr = dayjs().year();
  const årFraDato = dayjs(fraDato).year();
  let tidligsteMuligeÅr = årFraDato > nåværendeÅr ? årFraDato : nåværendeÅr - 1;
  if (tidligsteMuligeÅrFørNårværendeÅr) {
    const årstallForTidligsteMuligeÅr = nåværendeÅr - tidligsteMuligeÅrFørNårværendeÅr;
    // Dersom fraDato er senere enn årstallet for tidligste mulige år, benyttes årstallet for fraDato. Ellers benyttes årstallet for tidligste mulige år.
    if (årFraDato > årstallForTidligsteMuligeÅr) {
      tidligsteMuligeÅr = årFraDato;
    } else {
      tidligsteMuligeÅr = årstallForTidligsteMuligeÅr;
    }
  } else if (relativtFraÅr !== undefined) {
    tidligsteMuligeÅr = årFraDato - relativtFraÅr;
  }
  const år: TilgjengeligÅrOption[] = [{ value: '0', title: 'Dato for opphør', disabled: true }];
  for (let i = tidligsteMuligeÅr; i <= dayjs().year() + relativtTilÅr; i += 1) {
    år.push({ value: i.toString(), title: `31.12.${i.toString()}`, disabled: false });
  }
  return år;
};
