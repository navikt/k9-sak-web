import { SelectField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { Table } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import styles from './feilutbetalingPerioderTable.module.css';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';

const getHendelseUndertyper = (årsakNavn, årsaker) => {
  const årsak = årsaker.find(a => a.hendelseType === årsakNavn);
  return årsak && årsak.hendelseUndertyper.length > 0 ? årsak.hendelseUndertyper : null;
};

export const FeilutbetalingPerioderFormImpl = ({
  periode,
  årsak = null,
  elementId,
  årsaker,
  readOnly,
  onChangeÅrsak,
  onChangeUnderÅrsak,
}) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const hendelseUndertyper = getHendelseUndertyper(årsak, årsaker);
  return (
    <Table.Row shadeOnHover={false}>
      <Table.DataCell>
        {`${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`}
      </Table.DataCell>
      <Table.DataCell>
        <SelectField
          name={`perioder.${elementId}.årsak`}
          selectValues={årsaker.map(a => (
            <option key={a.hendelseType} value={a.hendelseType}>
              {kodeverkNavnFraKode(a.hendelseType, KodeverkType.HENDELSE_TYPE, 'kodeverkTilbake')}
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
            selectValues={hendelseUndertyper.map(hendelseUndertype => (
              <option key={hendelseUndertype} value={hendelseUndertype}>
                {kodeverkNavnFraKode(hendelseUndertype, KodeverkType.HENDELSE_UNDERTYPE, 'kodeverkTilbake')}
              </option>
            ))}
            validate={[required]}
            disabled={readOnly}
            onChange={event => onChangeUnderÅrsak(event, elementId, årsak)}
            bredde="m"
            label=""
          />
        )}
      </Table.DataCell>
      <Table.DataCell className={styles.redText}>{periode.belop}</Table.DataCell>
    </Table.Row>
  );
};

FeilutbetalingPerioderFormImpl.propTypes = {
  periode: PropTypes.shape().isRequired,
  elementId: PropTypes.number.isRequired,
  årsak: PropTypes.string,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChangeÅrsak: PropTypes.func.isRequired,
  onChangeUnderÅrsak: PropTypes.func.isRequired,
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
