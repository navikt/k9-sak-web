import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { YYYYMMDD_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { sortPeriodsByNewest, sortPeriodsChronological } from './periodUtils.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import type { Uttaksplan } from '@k9-sak-web/backend/k9sak/kontrakt/Uttaksplan.js';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket.js';
import type { Dayjs } from 'dayjs';

const oppholdHarUkedager = (tom: Dayjs, fom: Dayjs) => {
  for (let dag = tom.add(1, 'day'); dag.isBefore(fom); dag = dag.add(1, 'day')) {
    // hvis dag er en ukedag (mandag-fredag), returner true
    if ([1, 2, 3, 4, 5].includes(dag.day())) return true;
  }
  return false;
};

const sjekkOmPerioderErKantIKant = (periode: Periode, nestePeriode: Periode) =>
  !oppholdHarUkedager(initializeDate(periode.tom), initializeDate(nestePeriode.fom));

const lagUttaksperiodeliste = (uttaksperioder: Uttaksplan['perioder']): UttaksperiodeBeriket[] => {
  const perioder = Object.keys(uttaksperioder ?? {})
    .map(periodenøkkel => {
      const match = periodenøkkel.match(/^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
      if (!match) {
        return undefined; // ugyldig nøkkel
      }
      const [, fom, tom] = match;
      if (fom === undefined || tom === undefined) {
        return undefined; // ugyldig nøkkel
      }
      const andreUttaksperiodeData = (uttaksperioder ?? {})[periodenøkkel];
      const uttaksperiodeDato: Periode = {
        fom: initializeDate(fom).format(YYYYMMDD_DATE_FORMAT),
        tom: initializeDate(tom).format(YYYYMMDD_DATE_FORMAT),
      };
      const beriket: UttaksperiodeBeriket = {
        periode: uttaksperiodeDato,
        ...andreUttaksperiodeData,
      };
      return beriket;
    })
    .filter((p): p is UttaksperiodeBeriket => p !== undefined);

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
