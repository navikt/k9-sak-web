import React from 'react';
import PropTypes from 'prop-types';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { getUniqueListOfArbeidsforholdFields, createVisningsnavnForAktivitet } from '../ArbeidsforholdHelper';

const finnArbeidsforholdForAndel = (arbeidsforholdListe, val) => {
  const andelsnr = Number(val);
  return arbeidsforholdListe.find(arbeidsforhold => arbeidsforhold.andelsnr === andelsnr);
};

const setArbeidsforholdInfo = (fields, index, arbeidsforholdList, val) => {
  const field = fields.get(index);
  const arbeidsforhold = finnArbeidsforholdForAndel(arbeidsforholdList, val);
  if (arbeidsforhold) {
    field.arbeidsforholdId = arbeidsforhold.arbeidsforholdId;
    field.arbeidsgiverIdent = arbeidsforhold.arbeidsgiverIdent;
    field.arbeidsperiodeFom = arbeidsforhold.arbeidsperiodeFom;
    field.arbeidsperiodeTom = arbeidsforhold.arbeidsperiodeTom;
    field.andelsnrRef = arbeidsforhold.andelsnr;
  }
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};

const arbeidsgiverSelectValues = (arbeidsforholdList, alleKodeverk, arbeidsgiverOpplysningerPerId) =>
  arbeidsforholdList.map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold, alleKodeverk, arbeidsgiverOpplysningerPerId)}
    </option>
  ));

export const ArbeidsforholdFieldImpl = ({
  fields,
  index,
  name,
  readOnly,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
}) => {
  const arbeidsforholdList = getUniqueListOfArbeidsforholdFields(fields);
  return (
    <>
      {!fields.get(index).skalKunneEndreAktivitet && <InputField name={name} bredde="L" readOnly />}
      {fields.get(index).skalKunneEndreAktivitet && (
        <SelectField
          name={name}
          bredde="l"
          label={fieldLabel(index, 'BeregningInfoPanel.FordelingBG.Andel')}
          selectValues={arbeidsgiverSelectValues(arbeidsforholdList, alleKodeverk, arbeidsgiverOpplysningerPerId)}
          readOnly={readOnly}
          onChange={event => setArbeidsforholdInfo(fields, index, arbeidsforholdList, event.target.value)}
        />
      )}
    </>
  );
};

ArbeidsforholdFieldImpl.propTypes = {
  fields: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

export default ArbeidsforholdFieldImpl;
