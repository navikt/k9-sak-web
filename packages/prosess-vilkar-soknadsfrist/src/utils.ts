import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';

export const formatDate = (dato: string) => initializeDate(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = (innsendtDato: string, format: boolean = true) => {
  const dt = initializeDate(innsendtDato).startOf('month').subtract(3, 'months');

  if (format) {
    return dt.format('YYYY-MM-DD');
  }

  return dt;
};
