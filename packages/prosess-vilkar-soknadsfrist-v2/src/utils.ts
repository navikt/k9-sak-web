import { DDMMYYYY_DATE_FORMAT, initializeDate } from '@fpsak-frontend/utils';

export const formatDate = (dato: string) => initializeDate(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = (innsendtDato: string, format: boolean = true) => {
  const dt = initializeDate(innsendtDato).startOf('month').subtract(3, 'months');

  if (format) {
    return dt.format('YYYY-MM-DD');
  }

  return dt;
};
