import { isBefore, parse } from "date-fns";

import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import { OverlappendePeriode } from '@k9-sak-web/types';

/**
 * Hjelperfunksjon for å sortere periodene i radene til tidslinjen, ref. sorterOverlappendeRader
 * Sorterer periodene i kronologisk rekkefølge. 
 * 
 * @param perioder 
 * @returns 
 */

export const sorterOverlappendePerioder = (perioder: Periode<OverlappendePeriode>[]) => perioder.sort((periode1, periode2) => {
    if (isBefore(
        parse(periode1.fom, 'yyyy-MM-dd', new Date()),
        parse(periode2.fom, 'yyyy-MM-dd', new Date())
    )) {
        return -1;
    } if (isBefore(
        parse(periode2.fom, 'yyyy-MM-dd', new Date()),
        parse(periode1.fom, 'yyyy-MM-dd', new Date())
    )) {
        return 1;
    } return 0;
});

/**
 * Tar imot rader ment til bruk i Tidslinje i VedtakOverlappendeYtelsePanel.tsx
 * og sorterer dem slik at raden med den perioden som har tidligst dato kommer først.
 * 
 * @param rader 
 * @returns 
 */
export const sorterOverlappendeRader = (rader: { perioder: Periode<OverlappendePeriode>[] }[]) => rader.sort((rad1, rad2) => {
    const perioder1 = rad1.perioder;
    const perioder2 = rad2.perioder;

    sorterOverlappendePerioder(perioder1);
    sorterOverlappendePerioder(perioder2);

    if (isBefore(
        parse(perioder1[0].fom, 'yyyy-MM-dd', new Date()),
        parse(perioder2[0].fom, 'yyyy-MM-dd', new Date())
    )) {
        return -1;
    } if (isBefore(
        parse(perioder2[0].fom, 'yyyy-MM-dd', new Date()),
        parse(perioder1[0].fom, 'yyyy-MM-dd', new Date())
    )) {
        return 1;
    } return 0;
})