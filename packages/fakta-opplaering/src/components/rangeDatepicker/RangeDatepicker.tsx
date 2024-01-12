/* eslint-disable */
import { useField } from 'formik';
import React from 'react';

import { DatePicker, DatePickerProps, DateValidationT, RangeValidationT, useRangeDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import styles from './rangeDatepicker.modules.css';

type OwnProps = {
  name: string;
  onRangeChange: any;
  placeholder?: string;
} & DatePickerProps;

const fieldValidaton = (
  date: DateValidationT & {
    isBeforeFrom?: boolean;
  },
  setError: (v: string) => void,
  fromDate: Date,
  toDate: Date,
) => {
  if (date.isBefore) {
    return setError(`Datoen kan ikke være før ${dayjs(fromDate).format('DD.MM.YYYY')}`);
  }
  if (date.isAfter) {
    return setError(`Datoen kan ikke være etter ${dayjs(toDate).format('DD.MM.YYYY')}`);
  }
  if (date.isEmpty) {
    return setError('Datoen er påkrevd.');
  }

  if (date.isInvalid) {
    return setError('Datoen er ugyldig.');
  }

  if (date.isBeforeFrom) {
    return setError('Til-dato kan ikke være før fra-dato');
  }

  setError(undefined);
};

const RangeDatepicker = ({ name, fromDate, toDate, onRangeChange, placeholder, defaultSelected }: OwnProps) => {
  const [fieldFom, metaFom, fomHelpers] = useField({
    name: `${name}.fom`,
  });
  const [fieldTom, metaTom, tomHelpers] = useField({
    name: `${name}.tom`,
  });
  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    // @ts-ignore
    defaultSelected,
    fromDate,
    toDate,
    onRangeChange,
    onValidate: ({ from, to }: RangeValidationT) => {
      fieldValidaton(from, fomHelpers.setError, fromDate, toDate);
      fieldValidaton(to, tomHelpers.setError, fromDate, toDate);
    },
  });

  return (
    <div>
      <DatePicker {...datepickerProps}>
        <div className={styles['rangepicker-row']}>
          <DatePicker.Input
            {...fromInputProps}
            onBlur={_ => fomHelpers.setTouched(true, false)}
            error={metaFom.touched && metaFom.error}
            placeholder={placeholder}
            size="small"
            label="Fra"
          />
          <DatePicker.Input
            {...toInputProps}
            onBlur={_ => tomHelpers.setTouched(true, false)}
            error={metaTom.touched && metaTom.error}
            placeholder={placeholder}
            size="small"
            label="Til"
          />
        </div>
      </DatePicker>
    </div>
  );
};

export default RangeDatepicker;
