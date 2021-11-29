import React from 'react';
import PropTypes from 'prop-types';
import {
  dateFormat,
  hasValidDate,
  required,
  dateAfterOrEqual,
  parseCurrencyInput,
  minValueFormatted,
  maxValueFormatted,
  removeSpacesFromNumber,
  formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { DatepickerField, InputField } from '@fpsak-frontend/form';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import styles from './vurderEndringRefusjonRad.less';
import { createVisningsnavnForAktivitetRefusjon } from '../util/createVisningsnavnForAktivitet';

const FIELD_KEY_REFUSJONSTART = 'REFUSJON_ENDRING_DATO';
const FIELD_KEY_DELVIS_REF = 'DELVIS_REFUSJON_FØR_START_BELØP';

const lagNøkkel = (prefix, andel) => {
  if (andel.arbeidsgiver.arbeidsgiverOrgnr) {
    return `${prefix}${andel.arbeidsgiver.arbeidsgiverOrgnr}${andel.internArbeidsforholdRef}`;
  }
  return `${prefix}${andel.arbeidsgiver.arbeidsgiverAktørId}${andel.internArbeidsforholdRef}`;
};

export const lagNøkkelRefusjonsstart = (andel) => lagNøkkel(FIELD_KEY_REFUSJONSTART, andel);
export const lagNøkkelDelvisRefusjon = (andel) => lagNøkkel(FIELD_KEY_DELVIS_REF, andel);




export const VurderEndringRefusjonRadImpl = ({
  refusjonAndel,
  readOnly,
  erAksjonspunktÅpent,
  arbeidsgiverOpplysningerPerId,
  valgtDatoErLikSTP,
}) => {
  if (!refusjonAndel) {
    return null;
  }
  const navn = createVisningsnavnForAktivitetRefusjon(refusjonAndel, arbeidsgiverOpplysningerPerId);
  const andelTekst = refusjonAndel.skalKunneFastsetteDelvisRefusjon
    ? 'BeregningInfoPanel.RefusjonBG.TidligereRefusjon'
    : 'BeregningInfoPanel.RefusjonBG.IngenTidligereRefusjon';
  return (
    <>
      <Row>
        <Column xs="8">
          <FormattedMessage
            id={andelTekst}
            values={{
              ag: navn,
              dato: dateFormat(refusjonAndel.nyttRefusjonskravFom),
              b: (chunks) => <b>{chunks}</b>,
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="4">
          <Normaltekst className={styles.marginTopp}>
            <FormattedMessage
              id="BeregningInfoPanel.RefusjonBG.RefusjonFra"
            />
          </Normaltekst>
        </Column>
        <Column xs="4">
          <DatepickerField
            name={lagNøkkelRefusjonsstart(refusjonAndel)}
            readOnly={readOnly}
            validate={[required, hasValidDate, dateAfterOrEqual(refusjonAndel.tidligsteMuligeRefusjonsdato)]}
            isEdited={!!refusjonAndel.fastsattNyttRefusjonskravFom && !erAksjonspunktÅpent}
          />
        </Column>
      </Row>
      {refusjonAndel.skalKunneFastsetteDelvisRefusjon && !valgtDatoErLikSTP && (
        <Row>
          <Column xs="4">
            <Normaltekst className={styles.marginTopp}>
              <FormattedMessage
                id="BeregningInfoPanel.RefusjonBG.DelvisPrMnd"
              />
            </Normaltekst>
          </Column>
          <Column xs="4">
            <InputField
              name={lagNøkkelDelvisRefusjon(refusjonAndel)}
              bredde="S"
              validate={[required, minValueFormatted(1), maxValueFormatted(refusjonAndel.maksTillattDelvisRefusjonPrMnd)]}
              parse={parseCurrencyInput}
              readOnly={readOnly}
              isEdited={!!refusjonAndel.fastsattDelvisRefusjonPrMnd && !erAksjonspunktÅpent}
            />
          </Column>
        </Row>
      )}
    </>
  );
};

VurderEndringRefusjonRadImpl.propTypes = {
  refusjonAndel: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  erAksjonspunktÅpent: PropTypes.bool.isRequired,
  valgtDatoErLikSTP: PropTypes.bool.isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};




VurderEndringRefusjonRadImpl.buildInitialValues = (refusjonAndel) => {
  const initialValues = {};
  initialValues[lagNøkkelRefusjonsstart(refusjonAndel)] = refusjonAndel.fastsattNyttRefusjonskravFom;
  initialValues[lagNøkkelDelvisRefusjon(refusjonAndel)] = formatCurrencyNoKr(refusjonAndel.fastsattDelvisRefusjonPrMnd);
  return initialValues;
};

VurderEndringRefusjonRadImpl.transformValues = (values,
  andel,
  skjæringstidspunkt) => {
  const datoNøkkel = lagNøkkelRefusjonsstart(andel);
  const fastsattDato = values[datoNøkkel];
  let delvisRefusjonPrMnd = null;
  if (andel.skalKunneFastsetteDelvisRefusjon && fastsattDato !== skjæringstidspunkt) {
    const delvisNøkkel = lagNøkkelDelvisRefusjon(andel);
    delvisRefusjonPrMnd = removeSpacesFromNumber(values[delvisNøkkel]);
  }
  return {
    arbeidsgiverOrgnr: andel.arbeidsgiver.arbeidsgiverOrgnr,
    arbeidsgiverAktoerId: andel.arbeidsgiver.arbeidsgiverAktørId,
    internArbeidsforholdRef: andel.internArbeidsforholdRef,
    fastsattRefusjonFom: fastsattDato,
    delvisRefusjonPrMndFørStart: delvisRefusjonPrMnd,
  };
};

const erValgtDatoLikSTP = (stp, verdiFraForm) => {
  if (!verdiFraForm) {
    return false;
  }
  return new Date(verdiFraForm).getTime() === new Date(stp).getTime();
};

const mapStateToProps = (state, ownProps) => ({
  valgtDatoErLikSTP: (erValgtDatoLikSTP(ownProps.skjæringstidspunkt,
    formValueSelector(ownProps.formName)(state, lagNøkkelRefusjonsstart(ownProps.refusjonAndel)))),
});

const VurderEndringRefusjonRad = connect(mapStateToProps)(VurderEndringRefusjonRadImpl);

export default VurderEndringRefusjonRad;
