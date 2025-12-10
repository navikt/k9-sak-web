import React from 'react';
import { type DateInputProps, type DatePickerProps, DatePicker, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';

export type DatovelgerProps = Pick<DatePickerProps, 'defaultMonth' | 'fromDate' | 'toDate' | 'className'> &
  Pick<DateInputProps, 'hideLabel' | 'size' | 'label' | 'description' | 'id'> & {
    onChange: (value: string) => void;
    errorMessage?: React.ReactNode | string;
    selectedDay: string;
    disabled?: boolean;
    onBlur: () => void;
    value: string;
  };

const DatovelgerPlain = ({
  label,
  onChange,
  hideLabel,
  className,
  errorMessage,
  selectedDay,
  disabled,
  onBlur,
  value,
  fromDate,
  toDate,
  defaultMonth,
  size = 'small',
  id,
}: DatovelgerProps) => {
  const fromDateDefault = new Date().setFullYear(new Date().getFullYear() - 5);
  const toDateDefault = new Date().setFullYear(new Date().getFullYear() + 5);

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
  });

  return (
    <div className={className}>
      <DatePicker
        {...(datepickerProps as any)}
        showWeekNumber={true}
        mode="single"
        inputDisabled={disabled}
        onSelect={onBlur}
        dropdownCaption={true}
        fromDate={fromDate || fromDateDefault}
        toDate={toDate || toDateDefault}
        size={size}
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
          disabled={disabled}
          size={size}
          id={id}
        />
      </DatePicker>
    </div>
  );
};

export default DatovelgerPlain;
