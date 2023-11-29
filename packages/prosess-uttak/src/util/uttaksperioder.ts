import Period from '../types/Period';
import { Uttaksperiode } from '../types/Uttaksperiode';
import Uttaksperioder from '../types/Uttaksperioder';
import { sortPeriodsByNewest } from './periodUtils';

const lagUttaksperiodeliste = (uttaksperioder: Uttaksperioder): Uttaksperiode[] => {
  const perioder = Object.keys(uttaksperioder).map(periodenøkkel => {
    const uttaksperiode = new Period(periodenøkkel);
    const andreUttaksperiodeData = uttaksperioder[periodenøkkel];
    return {
      periode: uttaksperiode,
      ...andreUttaksperiodeData,
    };
  });
  const sortertePerioder = perioder.sort((p1, p2) => sortPeriodsByNewest(p1.periode, p2.periode));
  return sortertePerioder;
};

export default lagUttaksperiodeliste;
