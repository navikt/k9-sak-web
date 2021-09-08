import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { sortArbeidsforholdList, createVisningsnavnForAktivitet } from '../../ArbeidsforholdHelper';

const kortvarigStringId = 'BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold';

const createArbeidsforholdRadioKey = andel =>
  andel && andel.arbeidsforhold
    ? `${andel.arbeidsforhold.arbeidsgiverId}(${andel.arbeidsforhold.arbeidsforholdId})(${andel.andelsnr})`
    : '';
/**
 * TidsbegrensetArbeidsforholdForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for Vurder Tidsbegrenset Arbeidsforhold som ber
 * bruker bestemme om en liste med arbeidsforhold er tidsbegrenset eller ikke.
 */

export const TidsbegrensetArbeidsforholdFormImpl = ({
  readOnly,
  andelsliste,
  isAvklaringsbehovClosed,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  fieldArrayID,
}) => (
  <div>
    {andelsliste.map(andel => (
      <div
        key={`fastsettTidsbegrensedeForhold_${createVisningsnavnForAktivitet(
          andel.arbeidsforhold,
          alleKodeverk,
          arbeidsgiverOpplysningerPerId,
        )}`}
      >
        <Normaltekst>
          <FormattedMessage
            id={kortvarigStringId}
            values={{
              navn: createVisningsnavnForAktivitet(andel.arbeidsforhold, alleKodeverk, arbeidsgiverOpplysningerPerId),
              fom: moment(andel.arbeidsforhold.startdato).format(DDMMYYYY_DATE_FORMAT),
              tom: moment(andel.arbeidsforhold.opphoersdato).format(DDMMYYYY_DATE_FORMAT),
            }}
          />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={`${fieldArrayID}.${createArbeidsforholdRadioKey(andel)}`}
          validate={[required]}
          readOnly={readOnly}
          isEdited={isAvklaringsbehovClosed}
        >
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
        </RadioGroupField>
      </div>
    ))}
  </div>
);

TidsbegrensetArbeidsforholdFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  andelsliste: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

export const getSortedKortvarigeArbeidsforholdList = createSelector(
  [ownProps => ownProps.faktaOmBeregning],
  faktaOmBeregning => sortArbeidsforholdList(faktaOmBeregning.kortvarigeArbeidsforhold),
);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const andelsliste = getSortedKortvarigeArbeidsforholdList(ownProps);
  return () => ({
    andelsliste,
    fieldArrayID: ownProps.fieldArrayID,
  });
};

const TidsbegrensetArbeidsforholdForm = connect(mapStateToPropsFactory)(TidsbegrensetArbeidsforholdFormImpl);

TidsbegrensetArbeidsforholdForm.buildInitialValues = andeler => {
  const initialValues = {};
  if (!andeler) {
    return initialValues;
  }
  andeler.forEach(andel => {
    if (andel.erTidsbegrensetArbeidsforhold !== undefined) {
      initialValues[createArbeidsforholdRadioKey(andel)] = andel.erTidsbegrensetArbeidsforhold;
    }
  });
  return initialValues;
};

TidsbegrensetArbeidsforholdForm.transformValues = (values, andeler) => {
  const newValues = [];
  andeler.forEach(andel => {
    const fieldName = createArbeidsforholdRadioKey(andel);
    const booleanValue = values[fieldName];
    const valueObject = {
      andelsnr: andel.andelsnr,
      tidsbegrensetArbeidsforhold: booleanValue,
      opprinneligVerdi: andel.erTidsbegrensetArbeidsforhold,
    };
    newValues.push(valueObject);
  });
  return {
    vurderTidsbegrensetArbeidsforhold: { fastsatteArbeidsforhold: newValues },
  };
};

export default TidsbegrensetArbeidsforholdForm;
