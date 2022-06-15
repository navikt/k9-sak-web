import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn, required } from '@fpsak-frontend/utils';
import { SelectField, behandlingFormValueSelector } from '@fpsak-frontend/form';

import styles from './feilutbetalingPerioderTable.less';
import KodeverkType from 'kodeverk/src/kodeverkTyper';

const getHendelseUndertyper = (årsakNavn, årsaker) => {
  const årsak = årsaker.find(a => a.hendelseType === årsakNavn);
  return årsak && årsak.hendelseUndertyper.length > 0 ? årsak.hendelseUndertyper : null;
};

export const FeilutbetalingPerioderFormImpl = ({
  periode,
  årsak,
  elementId,
  årsaker,
  readOnly,
  onChangeÅrsak,
  onChangeUnderÅrsak,
  getKodeverknavn,
}) => {
  const hendelseUndertyper = getHendelseUndertyper(årsak, årsaker);
  return (
    <TableRow>
      <TableColumn>
        {`${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`}
      </TableColumn>
      <TableColumn>
        <SelectField
          name={`perioder.${elementId}.årsak`}
          selectValues={årsaker.map(a => (
            <option key={a.hendelseType} value={a.hendelseType}>
              {getKodeverknavn(a.hendelseType, KodeverkType.HENDELSE_TYPE)}
            </option>
          ))}
          validate={[required]}
          disabled={readOnly}
          onChange={event => onChangeÅrsak(event, elementId, årsak)}
          bredde="m"
          label=""
        />
        {hendelseUndertyper && (
          <SelectField
            name={`perioder.${elementId}.${årsak}.underÅrsak`}
            selectValues={hendelseUndertyper.map(a => (
              <option key={a} value={a}>
                {getKodeverknavn(a.hendelseType, KodeverkType.HENDELSE_UNDERTYPE)}
              </option>
            ))}
            validate={[required]}
            disabled={readOnly}
            onChange={event => onChangeUnderÅrsak(event, elementId, årsak)}
            bredde="m"
            label=""
          />
        )}
      </TableColumn>
      <TableColumn className={styles.redText}>{periode.belop}</TableColumn>
    </TableRow>
  );
};

FeilutbetalingPerioderFormImpl.defaultProps = {
  årsak: null,
};

FeilutbetalingPerioderFormImpl.propTypes = {
  periode: PropTypes.shape().isRequired,
  elementId: PropTypes.number.isRequired,
  årsak: PropTypes.string,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChangeÅrsak: PropTypes.func.isRequired,
  onChangeUnderÅrsak: PropTypes.func.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  årsak: behandlingFormValueSelector(
    ownProps.formName,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, `perioder.${ownProps.elementId}.årsak`),
});

const FeilutbetalingPerioderForm = connect(mapStateToProps)(FeilutbetalingPerioderFormImpl);
export default FeilutbetalingPerioderForm;
