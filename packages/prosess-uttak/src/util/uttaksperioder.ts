import { initializeDate } from '@fpsak-frontend/utils';
import Period from '../types/Period';
import { Uttaksperiode } from '../types/Uttaksperiode';
import Uttaksperioder from '../types/Uttaksperioder';
import { sortPeriodsByNewest, sortPeriodsChronological } from './periodUtils';

const sjekkOmPerioderErKantIKant = (periode: Period, nestePeriode: Period) => {
  const sisteUkeIFørstePeriode = initializeDate(periode.tom).week();
  const førsteUkeINestePeriode = initializeDate(nestePeriode.fom).week();
  return sisteUkeIFørstePeriode === førsteUkeINestePeriode || førsteUkeINestePeriode === sisteUkeIFørstePeriode + 1;
};

const lagUttaksperiodeliste = (uttaksperioder: Uttaksperioder): Uttaksperiode[] => {
  const perioder = Object.keys(uttaksperioder).map(periodenøkkel => {
    const uttaksperiode = new Period(periodenøkkel);
    const andreUttaksperiodeData = uttaksperioder[periodenøkkel];
    return {
      periode: uttaksperiode,
      ...andreUttaksperiodeData,
    };
  });
  const kronologiskSortertePerioder = perioder.sort((p1, p2) => sortPeriodsChronological(p1.periode, p2.periode));
  const perioderMedOppholdFlagg: Uttaksperiode[] = [];

  kronologiskSortertePerioder.forEach((uttaksperiode, index, array) => {
    const nestePeriode = array[index + 1];
    perioderMedOppholdFlagg.push({
      ...uttaksperiode,
      harOppholdTilNestePeriode:
        nestePeriode && !sjekkOmPerioderErKantIKant(uttaksperiode.periode, nestePeriode.periode),
    });
  });
  const reversertKronologiskSortertePerioder = perioderMedOppholdFlagg.sort((p1, p2) =>
    sortPeriodsByNewest(p1.periode, p2.periode),
  );
  return reversertKronologiskSortertePerioder;
};

export default lagUttaksperiodeliste;
