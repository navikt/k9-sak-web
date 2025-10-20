import { isBefore, parse } from 'date-fns';

import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import { Periodeinfo } from '../types/Periodeinfo';

/**
 * Hjelperfunksjon for å sortere periodene i radene til tidslinjen, ref. sorterOverlappendeRader
 * Sorterer periodene i kronologisk rekkefølge.
 */
const sorterOverlappendePerioder = (perioder: Periode<Periodeinfo>[]) =>
  [...perioder].sort((periode1, periode2) => {
    if (isBefore(parse(periode1.fom, 'yyyy-MM-dd', new Date()), parse(periode2.fom, 'yyyy-MM-dd', new Date())))
      return -1;

    if (isBefore(parse(periode2.fom, 'yyyy-MM-dd', new Date()), parse(periode1.fom, 'yyyy-MM-dd', new Date())))
      return 1;

    return 0;
  });

/**
 * Tar imot rader ment til bruk i Tidslinje i VedtakOverlappendeYtelsePanel.tsx
 * og sorterer dem slik at raden med den perioden som har tidligst dato kommer først.
 */
export const sorterOverlappendeRader = (rader: TidslinjeRad<Periodeinfo>[]) =>
  [...rader].sort((rad1, rad2) => {
    const perioder1 = sorterOverlappendePerioder(rad1.perioder);
    const perioder2 = sorterOverlappendePerioder(rad2.perioder);

    if (isBefore(parse(perioder1[0].fom, 'yyyy-MM-dd', new Date()), parse(perioder2[0].fom, 'yyyy-MM-dd', new Date())))
      return -1;

    if (isBefore(parse(perioder2[0].fom, 'yyyy-MM-dd', new Date()), parse(perioder1[0].fom, 'yyyy-MM-dd', new Date())))
      return 1;

    return 0;
  });
