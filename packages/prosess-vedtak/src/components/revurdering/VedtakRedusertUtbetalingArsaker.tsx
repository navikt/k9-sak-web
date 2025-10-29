import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import { CheckboxGroup } from '@navikt/ds-react';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import styles from './vedtakRedusertUtbetalingArsaker.module.css';

interface VedtakRedusertUtbetalingArsakerProps {
  intl: IntlShape;
  readOnly: boolean;
  values: Map<any, any>;
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
    <CheckboxGroup
      legend=""
      className={styles.wrapper}
      error={
        erSendtInnUtenArsaker &&
        ingenArsakErValgt &&
        "Minst én årsak til redusert utbetaling må være oppgitt."
      }
      size="small"
    >
      {Object.values(redusertUtbetalingArsak).map(name => (
        <CheckboxFieldFormik
          name={name}
          key={name}
          label={{ id: `VedtakForm.RedusertUtbetalingArsak.${name}` }}
          disabled={readOnly}
        />
      ))}
    </CheckboxGroup>
  );
};

export default VedtakRedusertUtbetalingArsaker;
