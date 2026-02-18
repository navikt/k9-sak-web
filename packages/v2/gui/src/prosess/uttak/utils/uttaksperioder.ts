import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { YYYYMMDD_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { sortPeriodsByNewest, sortPeriodsChronological } from './periodUtils';
import type {
  k9_sak_typer_Periode as Periode,
  pleiepengerbarn_uttak_kontrakter_Uttaksplan as Uttaksplan,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';

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
  const perioder = Object.keys(uttaksperioder ?? {})
    .map(periodenøkkel => {
      const match = periodenøkkel.match(/^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
      if (!match) {
        return undefined; // ugyldig nøkkel
      }
      const [, fom, tom] = match as RegExpMatchArray;
      const andreUttaksperiodeData = (uttaksperioder ?? {})[periodenøkkel];
      const uttaksperiodeDato: Periode = {
        fom: initializeDate(fom as string).format(YYYYMMDD_DATE_FORMAT),
        tom: initializeDate(tom as string).format(YYYYMMDD_DATE_FORMAT),
      };
      return {
        periode: uttaksperiodeDato,
        ...andreUttaksperiodeData,
      } as UttaksperiodeBeriket;
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
