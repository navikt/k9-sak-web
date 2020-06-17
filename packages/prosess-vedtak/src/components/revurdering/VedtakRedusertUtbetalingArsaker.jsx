import React from 'react';
import { CheckboxField } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import styles from './vedtakRedusertUtbetalingArsaker.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

const VedtakRedusertUtbetalingArsaker = ({ readOnly, values, vedtakVarsel }) => {
  return (
    <div className={styles.wrapper}>
      {Object.values(redusertUtbetalingArsak).map(name => (
        <CheckboxField
          name={name}
          key={name}
          label={{ id: `VedtakForm.RedusertUtbetalingArsak.${name}` }}
          disabled={readOnly}
          checked={readOnly ? vedtakVarsel.redusertUtbetalingÅrsaker?.some(key => key === name) : values.get(name)}
        />
      ))}
    </div>
  );
};

VedtakRedusertUtbetalingArsaker.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  values: PropTypes.instanceOf(Map),
  vedtakVarsel: vedtakVarselPropType,
};

export default VedtakRedusertUtbetalingArsaker;
