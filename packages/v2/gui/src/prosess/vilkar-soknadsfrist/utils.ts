import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Dayjs } from 'dayjs';
import type { SoknadsfristVilkarType } from './types/SoknadsfristVilkarType';

export const formatDate = (dato: string) => initializeDate(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = (innsendtDato: string, formatDate: boolean = true) => {
  const dt = initializeDate(innsendtDato).startOf('month').subtract(3, 'months');

  if (formatDate) {
    return dt.format('YYYY-MM-DD');
  }

  return dt;
};

export const dateSorter = (date1: Dayjs, date2: Dayjs) => {
  if (date1.isBefore(date2)) {
    return -1;
  }
  if (date2.isBefore(date1)) {
    return 1;
  }
  return 0;
};

export const dateStringSorter = (date1: string, date2: string) => {
  const date1AsDayjs = initializeDate(date1);
  const date2AsDayjs = initializeDate(date2);
  return dateSorter(date1AsDayjs, date2AsDayjs);
};

export const hentAktivePerioderFraVilkar = (vilkar: SoknadsfristVilkarType[], visAllePerioder: boolean) => {
  const [activeVilkår] = vilkar;

  if (!activeVilkår?.perioder) {
    return [];
  }

  return activeVilkår.perioder
    .filter(
      periode =>
        (visAllePerioder && !periode.vurderesIBehandlingen) || (periode.vurderesIBehandlingen && !visAllePerioder),
    )
    .sort((a, b) => (a.periode.fom && b.periode.fom ? dateStringSorter(a.periode.fom, b.periode.fom) : 0))
    .reverse();
};
