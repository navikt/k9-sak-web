import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/utils';
import moment from 'moment';

export const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = (innsendtDato, format = true) => {
  const dt = moment(innsendtDato).startOf('month').subtract(3, 'months');

  if (format) {
    return dt.format('YYYY-MM-DD');
  }

  return dt;
};
