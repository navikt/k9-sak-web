/* eslint-disable */
import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';

import {
  DatePickerProps,
  UNSAFE_DatePicker,
  UNSAFE_useRangeDatepicker,
  Label,
  DateValidationT,
} from '@navikt/ds-react';
import { validateAll } from '@fpsak-frontend/form/src/formikUtils';
import { required } from '@fpsak-frontend/utils';
import styles from './rangeDatepicker.modules.css';

type OwnProps = {
  name: string;
  onRangeChange: any;
} & DatePickerProps;

const validate = (date: DateValidationT) => {
  if (!date.isValidDate) {
    return 'Datoen er ikke valid';
  }
  if (required(date)) {
    return required(date).id;
  }

  return '';
};

const RangeDatepicker = ({ name, fromDate, toDate, onRangeChange, placeholder }: OwnProps) => {
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');
  const formik = useFormikContext();
  const [field, meta, lel] = useField({
    name,
  });
  const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
    fromDate,
    toDate,
    onRangeChange,
    onValidate(val) {
      const fromError = validate(val.from);
      const toError = validate(val.to);
      if (fromError) {
        setFromError(fromError);
        formik.setFieldError(`${name}.fom`, fromError);
      }
      if (toError) {
        setToError(toError);
        formik.setFieldError(`${name}.tom`, fromError);
      }
      if (!fromError && !toError) {
        lel.setError(undefined);
        setFromError(undefined);
        setToError(undefined);
      }
    },
  });

  return (
    <div>
      <UNSAFE_DatePicker {...datepickerProps}>
        <div className={styles['rangepicker-row']}>
          <UNSAFE_DatePicker.Input {...fromInputProps} placeholder={placeholder} size="small" label="Fra" />
          <UNSAFE_DatePicker.Input {...toInputProps} placeholder={placeholder} size="small" label="Til" />
        </div>
      </UNSAFE_DatePicker>
    </div>
  );
};

export default RangeDatepicker;
