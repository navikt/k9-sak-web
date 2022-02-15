import React from 'react';
import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import PropTypes from 'prop-types';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import styles from './vedtakRedusertUtbetalingArsaker.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

const VedtakRedusertUtbetalingArsaker = ({ intl, readOnly, values, erSendtInnUtenArsaker }) => {
  const ingenArsakErValgt = !Array.from(values.values()).includes(true);

  return (
    <CheckboxGruppe
      className={styles.wrapper}
      feil={
        erSendtInnUtenArsaker &&
        ingenArsakErValgt &&
        intl.formatMessage({ id: 'VedtakForm.RedusertUtbetalingArsaker.IkkeSatt' })
      }
    >
      {Object.values(redusertUtbetalingArsak).map(name => (
        <CheckboxFieldFormik
          name={name}
          key={name}
          label={{ id: `VedtakForm.RedusertUtbetalingArsak.${name}` }}
          disabled={readOnly}
          checked={values[name]}
        />
      ))}
    </CheckboxGruppe>
  );
};

VedtakRedusertUtbetalingArsaker.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  values: PropTypes.instanceOf(Map),
  erSendtInnUtenArsaker: PropTypes.bool.isRequired,
};

export default VedtakRedusertUtbetalingArsaker;
