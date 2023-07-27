import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { IntlShape } from 'react-intl';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import styles from './vedtakRedusertUtbetalingArsaker.less';

interface VedtakRedusertUtbetalingArsakerProps {
  intl: IntlShape;
  readOnly: boolean;
  values?: Map<any, any>;
  erSendtInnUtenArsaker: boolean;
}

const VedtakRedusertUtbetalingArsaker = ({
  intl,
  readOnly,
  values,
  erSendtInnUtenArsaker,
}: VedtakRedusertUtbetalingArsakerProps) => {
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
        />
      ))}
    </CheckboxGruppe>
  );
};

export default VedtakRedusertUtbetalingArsaker;
