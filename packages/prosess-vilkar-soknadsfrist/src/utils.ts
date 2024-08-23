import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

export const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = (innsendtDato, format = true) => {
  const dt = moment(innsendtDato).startOf('month').subtract(3, 'months');

  if (format) {
    return dt.format('YYYY-MM-DD');
  }

  return dt;
};
