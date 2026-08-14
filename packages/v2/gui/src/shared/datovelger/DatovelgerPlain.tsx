import { type DateInputProps, type DatePickerProps, DatePicker, useDatepicker } from '@navikt/ds-react';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import dayjs from 'dayjs';
import React from 'react';

export type DatovelgerProps = Pick<DatePickerProps, 'defaultMonth' | 'fromDate' | 'toDate' | 'className' | 'disabled'> &
  Pick<DateInputProps, 'hideLabel' | 'size' | 'label' | 'description' | 'id'> & {
    onChange: (value: string) => void;
    errorMessage?: React.ReactNode | string;
    selectedDay: string;
    onBlur: () => void;
    value: string;
    readOnly?: boolean;
  };

const DatovelgerPlain = ({
  label,
  onChange,
  hideLabel,
  className,
  errorMessage,
  selectedDay,
  readOnly,
  onBlur,
  value,
  fromDate,
  toDate,
  defaultMonth,
  size = 'small',
  id,
  disabled,
}: DatovelgerProps) => {
  const fromDateDefault = dayjs().subtract(5, 'year').toDate();
  const toDateDefault = dayjs().add(5, 'year').toDate();

  const defaultSelected = selectedDay ? dayjs(selectedDay).toDate() : undefined;

  // kalles både når man velger en dato i kalender og når man skriver inn en dato
  const onDateChange = (date?: Date) => {
    // skal kunne være gyldig dato eller tom
    if (!date) {
      onChange('');
      return;
    }

    const isoDateString = dayjs(date).format(ISO_DATE_FORMAT);
    if (isoDateString && isoDateString !== value) {
      onChange(isoDateString);
    }
  };

  const { datepickerProps, inputProps } = useDatepicker({
    defaultMonth,
    onDateChange: onDateChange,
    defaultSelected: defaultSelected,
    disabled: disabled,
  });

  return (
    <div className={className}>
      <DatePicker
        {...datepickerProps}
        showWeekNumber={true}
        onSelect={onBlur}
        dropdownCaption={true}
        fromDate={fromDate || fromDateDefault}
        toDate={toDate || toDateDefault}
      >
        <DatePicker.Input
          {...inputProps}
          hideLabel={hideLabel}
          label={label}
          onBlur={e => {
            onBlur();
            inputProps.onBlur?.(e);
          }}
          error={errorMessage}
          disabled={readOnly}
          size={size}
          id={id}
        />
      </DatePicker>
    </div>
  );
};

export default DatovelgerPlain;
