import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import type { Periode, Uttaksplan } from '@k9-sak-web/backend/k9sak/generated';
import { YYYYMMDD_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import type { UttaksperiodeBeriket } from '../Uttak';
import { sortPeriodsByNewest, sortPeriodsChronological } from './periodUtils';

const sjekkOmPerioderErKantIKant = (periode: Periode, nestePeriode: Periode) => {
  const sisteUkeIFørstePeriode = initializeDate(periode.tom).week();
  const førsteUkeINestePeriode = initializeDate(nestePeriode.fom).week();
  return (
    sisteUkeIFørstePeriode === førsteUkeINestePeriode ||
    førsteUkeINestePeriode === sisteUkeIFørstePeriode + 1 ||
    (sisteUkeIFørstePeriode >= 52 && førsteUkeINestePeriode === 1)
  );
};

const lagUttaksperiodeliste = (uttaksperioder: Uttaksplan['perioder']): UttaksperiodeBeriket[] => {
  const perioder = Object.keys(uttaksperioder ?? {}).map(periodenøkkel => {
    const andreUttaksperiodeData = (uttaksperioder ?? {})[periodenøkkel];
    const uttaksperiodeDato: Periode = {
      fom: initializeDate(periodenøkkel.split('/')[0] ?? '').format(YYYYMMDD_DATE_FORMAT),
      tom: initializeDate(periodenøkkel.split('/')[1] ?? '').format(YYYYMMDD_DATE_FORMAT),
    };
    return {
      periode: uttaksperiodeDato,
      ...andreUttaksperiodeData,
    };
  });
  const kronologiskSortertePerioder = perioder.sort((p1, p2) => sortPeriodsChronological(p1.periode, p2.periode));
  const perioderMedOppholdFlagg: UttaksperiodeBeriket[] = [];

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
