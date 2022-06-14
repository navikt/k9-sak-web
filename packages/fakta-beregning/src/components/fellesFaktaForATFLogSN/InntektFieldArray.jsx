import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { NavFieldGroup } from '@fpsak-frontend/form';
import { isArrayEmpty, removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { mapAndelToField, skalFastsetteInntektForSN } from './BgFordelingUtils';
import styles from './inntektFieldArray.less';
import { validateUlikeAndeler, validateUlikeAndelerWithGroupingFunction } from './ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../BeregningFormUtils';
import { AndelRow, getHeaderTextCodes } from './InntektFieldArrayRow';
import AddAndelButton from './AddAndelButton';
import SummaryRow from './SummaryRow';

const isDirty = (meta, isBeregningFormDirty) => meta.dirty || isBeregningFormDirty;

const getErrorMessage = (meta, intl, isBeregningFormDirty) =>
  meta.error && isDirty(meta, isBeregningFormDirty) && meta.submitFailed ? intl.formatMessage(...meta.error) : null;

const skalViseSletteknapp = (index, fields, readOnly) =>
  fields.get(index).skalKunneEndreAktivitet === true && !readOnly;

const skalViseRefusjon = fields => {
  let skalVise = false;
  fields.forEach((id, index) => {
    const { refusjonskrav } = fields.get(index);
    if (refusjonskrav !== '' && refusjonskrav !== null && refusjonskrav !== undefined) {
      skalVise = true;
    }
  });
  return skalVise;
};

const skalVisePeriode = fields => {
  let skalVise = false;
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.arbeidsgiverId !== '') {
      skalVise = true;
    }
  });
  return skalVise;
};

const removeAndel = (fields, index) => () => {
  fields.remove(index);
};

const skalViseRad = (field, skalFastsetteSN) =>
  field.aktivitetStatus !== aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE || skalFastsetteSN;

const createAndelerTableRows = (
  fields,
  readOnly,
  skalFastsetteSN,
  beregningsgrunnlag,
  behandlingId,
  behandlingVersjon,
  isAvklaringsbehovClosed,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  vilkaarPeriodeFieldArrayIndex,
) => {
  const rows = [];
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    if (skalViseRad(field, skalFastsetteSN)) {
      rows.push(
        <AndelRow
          key={andelElementFieldId}
          fields={fields}
          skalVisePeriode={skalVisePeriode(fields)}
          skalViseRefusjon={skalViseRefusjon(fields)}
          skalViseSletteknapp={skalViseSletteknapp(index, fields, readOnly)}
          andelElementFieldId={andelElementFieldId}
          readOnly={readOnly}
          removeAndel={removeAndel(fields, index)}
          index={index}
          behandlingId={behandlingId}
          beregningsgrunnlag={beregningsgrunnlag}
          behandlingVersjon={behandlingVersjon}
          isAvklaringsbehovClosed={isAvklaringsbehovClosed}
          alleKodeverk={alleKodeverk}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          vilkaarPeriodeFieldArrayIndex={vilkaarPeriodeFieldArrayIndex}
        />,
      );
    }
  });
  return rows;
};

const createBruttoBGSummaryRow = (fields,
  readOnly,
  beregningsgrunnlag,
  behandlingId,
  behandlingVersjon,
  vilkaarPeriodeFieldArrayIndex,) => (
  <SummaryRow
    readOnly={readOnly}
    key="summaryRow"
    skalVisePeriode={skalVisePeriode(fields)}
    skalViseRefusjon={skalViseRefusjon(fields)}
    fields={fields}
    beregningsgrunnlag={beregningsgrunnlag}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    vilkaarPeriodeFieldArrayIndex={vilkaarPeriodeFieldArrayIndex}
  />
);

/**
 *  InntektFieldArray
 *
 * Presentasjonskomponent: Viser fordeling for andeler
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const InntektFieldArrayImpl = ({
  fields,
  meta,
  intl,
  readOnly,
  isBeregningFormDirty,
  erKunYtelse,
  skalKunneLeggeTilAndel,
  skalFastsetteSN,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  isAvklaringsbehovClosed,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  vilkaarPeriodeFieldArrayIndex,
}) => {
  const tablerows = createAndelerTableRows(
    fields,
    readOnly,
    skalFastsetteSN,
    beregningsgrunnlag,
    behandlingId,
    behandlingVersjon,
    isAvklaringsbehovClosed,
    alleKodeverk,
    arbeidsgiverOpplysningerPerId,
    vilkaarPeriodeFieldArrayIndex
  );

  if (tablerows.length === 0) {
    return null;
  }
  tablerows.push(createBruttoBGSummaryRow(fields,
    readOnly,
    beregningsgrunnlag,
    behandlingId,
    behandlingVersjon,
    vilkaarPeriodeFieldArrayIndex));
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl, isBeregningFormDirty)}>
      <Table
        headerTextCodes={getHeaderTextCodes(skalVisePeriode(fields), skalViseRefusjon(fields))}
        noHover
        classNameTable={styles.inntektTable}
      >
        {tablerows}
      </Table>
      {!readOnly && skalKunneLeggeTilAndel && (
        <AddAndelButton erKunYtelse={erKunYtelse} fields={fields} alleKodeverk={alleKodeverk} />
      )}
      <VerticalSpacer eightPx />
    </NavFieldGroup>
  );
};

InntektFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
  skalKunneLeggeTilAndel: PropTypes.bool,
  skalFastsetteSN: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  vilkaarPeriodeFieldArrayIndex: PropTypes.number.isRequired,
};

InntektFieldArrayImpl.defaultProps = {
  skalKunneLeggeTilAndel: true,
};

const InntektFieldArray = injectIntl(InntektFieldArrayImpl);

InntektFieldArray.transformValues = values =>
  values
    ? values
      .filter(({ skalRedigereInntekt }) => skalRedigereInntekt)
      .map(fieldValue => ({
        andelsnr: fieldValue.andelsnr,
        fastsattBelop: removeSpacesFromNumber(fieldValue.fastsattBelop),
        inntektskategori: fieldValue.inntektskategori,
        nyAndel: fieldValue.nyAndel,
        lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
        aktivitetStatus: fieldValue.aktivitetStatus,
        arbeidsforholdId: fieldValue.arbeidsforholdId,
        arbeidsgiverIdent: fieldValue.arbeidsgiverIdent,
      }))
    : null;

const mapAndelToSortedObject = ({ andel, inntektskategori }) => ({ andelsinfo: andel, inntektskategori });

InntektFieldArray.validate = (values, erKunYtelse, skalRedigereInntekt) => {
  const arrayErrors = values.map(andelFieldValues => {
    const { andel, fastsattBelop, inntektskategori } = andelFieldValues;
    const andelErr = required(andel);
    const fastsattBelopErr = skalRedigereInntekt(andelFieldValues) ? required(fastsattBelop) : null;
    const inntektskategoriErr = required(inntektskategori);
    return andelErr || fastsattBelopErr || inntektskategoriErr
      ? { andel: andelErr, fastsattBelop: fastsattBelopErr, inntektskategori: inntektskategoriErr }
      : null;
  });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isArrayEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = erKunYtelse
    ? validateUlikeAndelerWithGroupingFunction(values, mapAndelToSortedObject)
    : validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  return null;
};

InntektFieldArray.buildInitialValues = (andeler, alleKodeverk, arbeidsgiverOpplysningerPerId) => {
  if (!andeler || andeler.length === 0) {
    return {};
  }
  return andeler.map(a => mapAndelToField(a, alleKodeverk, arbeidsgiverOpplysningerPerId));
};

export const mapStateToProps = (state, ownProps) => {
  const isBeregningFormDirty = isFormDirty(state, ownProps);
  const skalFastsetteSN = skalFastsetteInntektForSN(state, ownProps);
  const tilfeller = ownProps.beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller || [];

  return {
    skalFastsetteSN,
    isBeregningFormDirty,
    erKunYtelse: tilfeller && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};

export default connect(mapStateToProps)(InntektFieldArray);
