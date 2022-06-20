import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import KodeverkType from 'kodeverk/src/kodeverkTyper';
import moment from 'moment';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverNavn =
    arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverIdent]
      ? arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverIdent].navn
      : '';

  if (!arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType, KodeverkType.OPPTJENING_AKTIVITET_TYPE) : '';
  }

  return `${arbeidsgiverNavn} (${aktivitet.arbeidsgiverIdent})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`;
};

export const createVisningsnavnForAktivitetRefusjon = (andel, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverId = andel.arbeidsgiver.arbeidsgiverOrgnr || andel.arbeidsgiver.arbeidsgiverAktørId;
  const agOpplysning = arbeidsgiverOpplysningerPerId[arbeidsgiverId];
  if (!agOpplysning) {
    return '';
  }
  if (agOpplysning.erPrivatPerson) {
    if (agOpplysning.fødselsdato) {
      return `${agOpplysning.navn} (${moment(agOpplysning.fødselsdato).format(DDMMYYYY_DATE_FORMAT)})${getEndCharFromId(
        andel.eksternArbeidsforholdRef,
      )}`;
    }
    return `${agOpplysning.navn}${getEndCharFromId(andel.eksternArbeidsforholdRef)}`;
  }
  return `${agOpplysning.navn} (${arbeidsgiverId})${getEndCharFromId(andel.eksternArbeidsforholdRef)}`;
};

export default createVisningsnavnForAktivitet;
