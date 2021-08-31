import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

export const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

export const utledInnsendtSoknadsfrist = innsendtDato =>
  moment(innsendtDato).startOf('month').subtract(3, 'months').format('YYYY-MM-DD');
