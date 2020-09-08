import React from 'react';
import { CheckboxField } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import { CheckboxGruppe } from "nav-frontend-skjema";
import styles from './vedtakRedusertUtbetalingArsaker.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';

const VedtakRedusertUtbetalingArsaker = ({ intl, readOnly, values, vedtakVarsel, erSendtInnUtenArsaker }) => {
  const ingenArsakErValgt = !Array.from(values.values()).includes(true);
  return (
    <CheckboxGruppe
      className={styles.wrapper}
      feil={erSendtInnUtenArsaker && ingenArsakErValgt && intl.formatMessage({id: 'VedtakForm.RedusertUtbetalingArsaker.IkkeSatt'})}
    >
      {Object.values(redusertUtbetalingArsak).map(name => (
        <CheckboxField
          name={name}
          key={name}
          label={{ id: `VedtakForm.RedusertUtbetalingArsak.${name}` }}
          disabled={readOnly}
          checked={readOnly ? vedtakVarsel.redusertUtbetalingÅrsaker?.some(key => key === name) : values.get(name)}
        />
      ))}
    </CheckboxGruppe>
  );
};

VedtakRedusertUtbetalingArsaker.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  values: PropTypes.instanceOf(Map),
  vedtakVarsel: vedtakVarselPropType,
  erSendtInnUtenArsaker: PropTypes.bool.isRequired,
};

export default VedtakRedusertUtbetalingArsaker;
