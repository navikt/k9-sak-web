import PropTypes from 'prop-types';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { finnEksternIdSubstring } from "./ReferanseUtil";

export const createVisningsnavnForAktivitet = (aktivitet, alleKodeverk, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverOpplysninger =
    arbeidsgiverOpplysningerPerId && aktivitet.arbeidsgiverIdent
      ? arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverIdent]
      : {};

  const arbeidsgiverNavn = arbeidsgiverOpplysninger?.navn;

  if (!arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType
      ? getKodeverknavnFn(alleKodeverk, kodeverkTyper)(aktivitet.arbeidsforholdType)
      : '';
  }

  if (arbeidsgiverOpplysninger.erPrivatPerson) {
    return arbeidsgiverOpplysninger.fødselsdato
      ? `${arbeidsgiverOpplysninger.navn} (${moment(arbeidsgiverOpplysninger.fødselsdato).format(
        DDMMYYYY_DATE_FORMAT,
      )})${finnEksternIdSubstring(aktivitet.arbeidsgiverIdent, aktivitet.arbeidsforholdId, arbeidsgiverOpplysningerPerId)}`
      : `${arbeidsgiverOpplysninger.navn}${finnEksternIdSubstring(aktivitet.arbeidsgiverIdent, aktivitet.arbeidsforholdId, arbeidsgiverOpplysningerPerId)}`;
  }
  return aktivitet.arbeidsgiverIdent
    ? `${arbeidsgiverNavn} (${aktivitet.arbeidsgiverIdent})${finnEksternIdSubstring(aktivitet.arbeidsgiverIdent, aktivitet.arbeidsforholdId, arbeidsgiverOpplysningerPerId)}`
    : arbeidsgiverNavn;
};

export const sortArbeidsforholdList = arbeidsforhold => {
  const copy = arbeidsforhold.slice(0);
  copy.sort((a, b) => new Date(a.arbeidsforhold.startdato) - new Date(b.arbeidsforhold.startdato));
  return copy;
};

export const arbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverIdent: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});

const arbeidsforholdEksistererIListen = (arbeidsforhold, arbeidsgiverList) => {
  if (arbeidsforhold.arbeidsforholdId === null) {
    return arbeidsgiverList.map(({arbeidsgiverIdent}) => arbeidsgiverIdent).includes(arbeidsforhold.arbeidsgiverIdent);
  }
  return arbeidsgiverList.map(({arbeidsforholdId}) => arbeidsforholdId).includes(arbeidsforhold.arbeidsforholdId);
};

export const getUniqueListOfArbeidsforholdFields = fields => {
  const arbeidsgiverList = [];
  if (fields === undefined) {
    return arbeidsgiverList;
  }
  fields.forEach((id, index) => {
    const field = fields.get(index);

    if (!arbeidsforholdEksistererIListen(field, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: field.andelsnr,
        arbeidsforholdId: field.arbeidsforholdId,
        arbeidsgiverIdent: field.arbeidsgiverIdent,
        arbeidsperiodeFom: field.arbeidsperiodeFom,
        arbeidsperiodeTom: field.arbeidsperiodeTom,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};
