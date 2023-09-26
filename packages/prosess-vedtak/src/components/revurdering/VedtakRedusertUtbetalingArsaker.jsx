import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import styles from './vedtakRedusertUtbetalingArsaker.module.css';

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
