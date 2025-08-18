import dayjs from 'dayjs';

import { DDMMYYYY_DATE_FORMAT } from '@navikt/ft-utils';
import type { ArbeidsgiverOpplysninger } from '../../types/ArbeidsgiverOpplysninger';

const getEndCharFromId = (id?: string): string => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAktivitetFordeling = (
  agOpplysninger: ArbeidsgiverOpplysninger,
  eksternArbeidsgiverId?: string,
): string => {
  const { navn, fødselsdato, erPrivatPerson, identifikator } = agOpplysninger;
  if (erPrivatPerson) {
    return fødselsdato
      ? `${navn} (${dayjs(fødselsdato).format(DDMMYYYY_DATE_FORMAT)})${getEndCharFromId(eksternArbeidsgiverId)}`
      : navn;
  }
  return identifikator ? `${navn} (${identifikator})${getEndCharFromId(eksternArbeidsgiverId)}` : navn;
};
