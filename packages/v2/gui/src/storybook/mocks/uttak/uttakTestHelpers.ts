import dayjs, { type Dayjs } from 'dayjs';

/**
 * Genererer relative perioder basert på dagens dato.
 * Nyttig for å lage testdata som alltid er relevante uavhengig av når testen kjøres.
 * 
 * @returns Objekt med to perioder, hver med fom og tom som dayjs-objekter
 * 
 * @example
 * ```typescript
 * const { periode1, periode2 } = lagRelativePerioder();
 * // periode1: 4 uker siden til 3 uker siden
 * // periode2: 2 uker siden til 1 uke siden
 * console.log(periode1.fom.format('YYYY-MM-DD')); // e.g., "2024-12-18"
 * console.log(periode1.tom.format('YYYY-MM-DD')); // e.g., "2024-12-25"
 * ```
 */
export const lagRelativePerioder = () => ({
  periode1: {
    fom: dayjs().subtract(4, 'week'),
    tom: dayjs().subtract(3, 'week'),
  },
  periode2: {
    fom: dayjs().subtract(2, 'week'),
    tom: dayjs().subtract(1, 'week'),
  },
});

/**
 * Beregner splitt-datoer for en periode.
 * Nyttig for tester som skal dele opp perioder.
 * 
 * @param fom - Start-dato for perioden
 * @param daysFromStart - Antall dager fra start til splitt-start (standard: 2)
 * @param splitDuration - Varighet av splitt-perioden i dager (standard: 2)
 * @returns Objekt med splittFom og splittTom som dayjs-objekter
 * 
 * @example
 * ```typescript
 * const startDato = dayjs('2024-01-01');
 * const { splittFom, splittTom } = beregnSplittDatoer(startDato, 2, 3);
 * // splittFom: 2024-01-03 (2 dager etter start)
 * // splittTom: 2024-01-06 (3 dager varighet)
 * console.log(splittFom.format('YYYY-MM-DD')); // "2024-01-03"
 * console.log(splittTom.format('YYYY-MM-DD')); // "2024-01-06"
 * ```
 */
export const beregnSplittDatoer = (
  fom: Dayjs,
  daysFromStart: number = 2,
  splitDuration: number = 2,
) => ({
  splittFom: fom.add(daysFromStart, 'day'),
  splittTom: fom.add(daysFromStart + splitDuration, 'day'),
});

/**
 * Konverterer dayjs-objekt til ISO-datostreng (YYYY-MM-DD).
 * Wrapper for dayjs.format('YYYY-MM-DD').
 * 
 * @param dato - Dayjs-objekt som skal konverteres
 * @returns ISO-formatert datostreng
 * 
 * @example
 * ```typescript
 * const dato = dayjs('2024-01-15');
 * const isoString = tilIsoDato(dato);
 * console.log(isoString); // "2024-01-15"
 * ```
 */
export const tilIsoDato = (dato: Dayjs): string => dato.format('YYYY-MM-DD');

/**
 * Konverterer dayjs-objekt til norsk visningsformat (DD.MM.YYYY).
 * Wrapper for dayjs.format('DD.MM.YYYY').
 * 
 * @param dato - Dayjs-objekt som skal konverteres
 * @returns Norsk formatert datostreng
 * 
 * @example
 * ```typescript
 * const dato = dayjs('2024-01-15');
 * const visningsDato = tilVisningsDato(dato);
 * console.log(visningsDato); // "15.01.2024"
 * ```
 */
export const tilVisningsDato = (dato: Dayjs): string => dato.format('DD.MM.YYYY');
