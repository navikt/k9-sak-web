import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { Table } from '@fpsak-frontend/shared-components';

import FeilutbetalingPerioderForm from './FeilutbetalingPerioderForm';

import styles from './feilutbetalingPerioderTable.css';

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const FeilutbetalingPerioderTable = ({
  perioder,
  formName,
  årsaker,
  readOnly,
  onChangeÅrsak,
  onChangeUnderÅrsak,
  behandlingId,
  behandlingVersjon,
}) => (
  <div className={styles.feilutbetalingTable}>
    <Table headerTextCodes={headerTextCodes} noHover>
      {perioder
        .sort((a, b) => moment(a.fom) - moment(b.fom))
        .map((periode, index) => (
          <FeilutbetalingPerioderForm
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            periode={periode}
            elementId={index}
            formName={formName}
            årsaker={årsaker}
            readOnly={readOnly}
            onChangeÅrsak={onChangeÅrsak}
            onChangeUnderÅrsak={onChangeUnderÅrsak}
            key={`formIndex${index + 1}`}
          />
        ))}
    </Table>
  </div>
);

FeilutbetalingPerioderTable.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChangeÅrsak: PropTypes.func.isRequired,
  onChangeUnderÅrsak: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export default FeilutbetalingPerioderTable;
