import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { InputField, NavFieldGroup, SelectField, ReadOnlyField } from '@fpsak-frontend/form';
import {
  formatCurrencyNoKr,
  isArrayEmpty,
  parseCurrencyInput,
  removeSpacesFromNumber,
  required,
  getKodeverknavnFn,
} from '@fpsak-frontend/utils';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { createSelector } from 'reselect';
import { Image, Table, TableColumn, TableRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import styles from './brukersAndelFieldArray.less';
import { validateUlikeAndelerWithGroupingFunction } from '../ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../../BeregningFormUtils';

const defaultBGFordeling = (aktivitetStatuser, alleKodeverk) => ({
  andel: getKodeverknavnFn(
    alleKodeverk,
    kodeverkTyper,
  )(aktivitetStatuser.filter((kode) => kode === aktivitetStatus.BRUKERS_ANDEL)[0]),
  fastsattBelop: '',
  inntektskategori: '',
  nyAndel: true,
  lagtTilAvSaksbehandler: true,
});

const inntektskategoriSelectValues = kategorier =>
  kategorier.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));

const summerFordeling = fields => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fastsattBelop ? parseInt(removeSpacesFromNumber(fields.get(index).fastsattBelop), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isDirty = (meta, isBeregningFormDirty) => meta.dirty || isBeregningFormDirty;

const renderMessage = (intl, error) => (error[0] && error[0].id ? intl.formatMessage(...error) : error);

const getErrorMessage = (meta, intl, isBeregningFormDirty) =>
  meta.error && isDirty(meta, isBeregningFormDirty) && meta.submitFailed ? renderMessage(intl, meta.error) : null;

function skalViseSletteknapp(index, fields, readOnly) {
  return (fields.get(index).nyAndel || fields.get(index).lagtTilAvSaksbehandler) && !readOnly;
}
const onKeyDown = (fields, aktivitetStatuser, alleKodeverk) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(defaultBGFordeling(aktivitetStatuser, alleKodeverk));
  }
};

const createAndelerTableRows = (fields, isAvklaringsbehovClosed, readOnly, inntektskategoriKoder, intl) =>
  fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        <FormattedMessage id="BeregningInfoPanel.FordelingBG.Ytelse" />
      </TableColumn>
      <TableColumn className={styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.fastsattBelop`}
          bredde="M"
          parse={parseCurrencyInput}
          readOnly={readOnly}
          isEdited={isAvklaringsbehovClosed}
        />
      </TableColumn>
      <TableColumn className={styles.rightAlign}>
        <SelectField
          label=""
          name={`${andelElementFieldId}.inntektskategori`}
          bredde="l"
          selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
          value={fields.get(index).inntektskategori}
          readOnly={readOnly}
          isEdited={isAvklaringsbehovClosed}
        />
      </TableColumn>
      <TableColumn>
        {skalViseSletteknapp(index, fields, readOnly) && (
          <button
            className={styles.buttonRemove}
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
            title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.FjernAndel' })}
          />
        )}
      </TableColumn>
    </TableRow>
  ));
const createBruttoBGSummaryRow = (sumFordeling, readOnly) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.Sum" />
    </TableColumn>
    <TableColumn className={readOnly ? styles.leftAlign : styles.rightAlign}>
      <ReadOnlyField
        input={{ value: sumFordeling }}
        type="text"
        parse={parseCurrencyInput}
        readOnly
      />
    </TableColumn>
    <TableColumn />
  </TableRow>
);

const getHeaderTextCodes = () => [
  'BeregningInfoPanel.FordelingBG.Andel',
  'BeregningInfoPanel.FordelingBG.Inntekt',
  'BeregningInfoPanel.FordelingBG.Inntektskategori',
];

/**
 *  BrukersAndelFieldArray
 *
 * Presentasjonskomponent: Viser fordeling for brukers andel ved kun ytelse
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const BrukersAndelFieldArrayImpl = ({
  fields,
  meta,
  intl,
  inntektskategoriKoder,
  aktivitetStatuser,
  readOnly,
  isAvklaringsbehovClosed,
  isBeregningFormDirty,
  alleKodeverk,
}) => {
  const sumFordeling = summerFordeling(fields) || 0;
  const tablerows = createAndelerTableRows(fields, isAvklaringsbehovClosed, readOnly, inntektskategoriKoder, intl);
  tablerows.push(createBruttoBGSummaryRow(sumFordeling, readOnly));
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl, isBeregningFormDirty)}>
      <Table headerTextCodes={getHeaderTextCodes()} noHover classNameTable={styles.inntektTable}>
        {tablerows}
      </Table>
      {!readOnly && (
        <Row className={styles.buttonRow}>
          <Column xs="3">
            {
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            }
            <div
              id="leggTilAndelDiv"
              onClick={() => {
                fields.push(defaultBGFordeling(aktivitetStatuser, alleKodeverk));
              }}
              onKeyDown={onKeyDown(fields, aktivitetStatuser, alleKodeverk)}
              className={styles.addPeriode}
              role="button"
              tabIndex="0"
              title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.LeggTilAndel' })}
            >
              <Image className={styles.addCircleIcon} src={addCircleIcon} />
              <Undertekst className={styles.imageText}>
                <FormattedMessage id="BeregningInfoPanel.FordelingBG.LeggTilAndel" />
              </Undertekst>
            </div>
          </Column>
        </Row>
      )}
      <VerticalSpacer eightPx />
    </NavFieldGroup>
  );
};

BrukersAndelFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  aktivitetStatuser: kodeverkPropType.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

const BrukersAndelFieldArray = injectIntl(BrukersAndelFieldArrayImpl);

const mapBrukesAndelToSortedObject = value => {
  const { andel, inntektskategori } = value;
  return { andelsinfo: andel, inntektskategori };
};

BrukersAndelFieldArray.validate = values => {
  if (!values) {
    return null;
  }
  const arrayErrors = values.map(({ fastsattBelop, inntektskategori }) => {
    const fastsattBelopErr = required(fastsattBelop);
    const inntektskategoriErr = required(inntektskategori);
    return fastsattBelopErr || inntektskategoriErr
      ? { fastsattBelop: fastsattBelopErr, inntektskategori: inntektskategoriErr }
      : null;
  });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isArrayEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndelerWithGroupingFunction(values, mapBrukesAndelToSortedObject);
  if (ulikeAndelerError) {
    return { _error: <FormattedMessage id={ulikeAndelerError[0].id} /> };
  }
  return null;
};

export const getInntektskategorierAlfabetiskSortert = createSelector(
  [ownProps => ownProps.alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI]],
  kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn)),
);

const mapStateToProps = (state, ownProps) => {
  const isBeregningFormDirty = isFormDirty(state, ownProps);
  const aktivitetStatuser = ownProps.alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];
  return {
    isBeregningFormDirty,
    aktivitetStatuser,
    inntektskategoriKoder: getInntektskategorierAlfabetiskSortert(ownProps),
  };
};

export default connect(mapStateToProps)(BrukersAndelFieldArray);
