import { ArbeidsgiverOpplysninger } from '@k9-sak-web/types';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

const getEndCharFromId = (id: string | undefined): string => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const createVisningsnavnForAktivitet = (
  arbeidsgiverOpplysninger: ArbeidsgiverOpplysninger,
  eksternReferanse: string | undefined,
): string => {
  const { navn, fødselsdato, erPrivatPerson, identifikator } = arbeidsgiverOpplysninger;
  if (erPrivatPerson) {
    return fødselsdato
      ? `${navn} (${moment(fødselsdato).format(DDMMYYYY_DATE_FORMAT)})${getEndCharFromId(eksternReferanse)}`
      : navn;
  }
  return identifikator ? `${navn} (${identifikator})${getEndCharFromId(eksternReferanse)}` : navn;
};

export default createVisningsnavnForAktivitet;
