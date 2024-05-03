import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@k9-sak-web/utils/src/formats';
import moment from 'moment';

const fomDatoBegrensning = søknadsperiodeFom => {
  const march30th = moment('2020-03-30', ISO_DATE_FORMAT);
  if (søknadsperiodeFom.isBefore(march30th)) {
    return march30th;
  }
  return søknadsperiodeFom;
};

// eslint-disable-next-line
export const startdatoErISøknadsperiode = (startdato, søknadsperiode) => {
  const søknadsperiodeFom = fomDatoBegrensning(moment(søknadsperiode.fom, ISO_DATE_FORMAT));
  const søknadsperiodeTom = moment(søknadsperiode.tom, ISO_DATE_FORMAT);
  const startdatoMoment = moment(startdato, ISO_DATE_FORMAT);
  if (startdatoMoment.isSameOrAfter(søknadsperiodeFom) && startdatoMoment.isSameOrBefore(søknadsperiodeTom)) {
    return null;
  }
  return [
    { id: 'ValidationMessage.InvalidStartdato' },
    { fom: søknadsperiodeFom.format(DDMMYYYY_DATE_FORMAT), tom: søknadsperiodeTom.format(DDMMYYYY_DATE_FORMAT) },
  ];
};
