import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { ChangeEvent, ReactNode } from 'react';

dayjs.extend(customParseFormat);

interface OwnProps {
  label?: ReactNode;
  disabled?: boolean;
  onChange: (dato: string | ChangeEvent) => void;
  value?: string;
  initialMonth?: Date;
  disabledDays?: { before: Date; after: Date } | { before: Date; after: Date }[];
  error?: React.Component | string;
  hideLabel?: boolean;
  inputId?: string;
}

const Datepicker: React.FC<OwnProps> = props => {
  const stringToDate = (date: string | Date): Date => {
    const newDate = dayjs(date, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT, 'YYYY.MM.DD'], true);
    return newDate.isValid() ? newDate.toDate() : undefined;
  };
  const { error, value, onChange, disabled, label, initialMonth, disabledDays, hideLabel, inputId } = props;

  const getDefaultMonth = () => {
    if (initialMonth) {
      return initialMonth;
    }
    if (!value && disabledDays) {
      if (Array.isArray(disabledDays)) {
        return disabledDays[disabledDays.length - 1].after;
      }
      return disabledDays.after;
    }
    return undefined;
  };

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: date => {
      if (date !== undefined) {
        const verdi = dayjs(date).format(ISO_DATE_FORMAT);
        if (onChange) {
          onChange(verdi);
        }
      }
    },
    defaultSelected: value ? stringToDate(value) : undefined,
    defaultMonth: getDefaultMonth(),
  });

  const dpProps = {
    ...datepickerProps,
    fromDate: disabledDays ? (Array.isArray(disabledDays) ? disabledDays[0].before : disabledDays?.before) : undefined,
    toDate: disabledDays
      ? Array.isArray(disabledDays)
        ? disabledDays[disabledDays.length - 1].after
        : disabledDays?.after
      : undefined,
  };

  return (
    <DatePicker {...dpProps}>
      <DatePicker.Input
        {...inputProps}
        hideLabel={hideLabel}
        size="small"
        label={label}
        disabled={disabled}
        error={error}
        id={inputId}
      />
    </DatePicker>
  );
};

export default Datepicker;
