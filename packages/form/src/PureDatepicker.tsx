/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import { DatepickerLimitations } from './DatepickerLimitations';
import styles from './datepicker.module.css';

dayjs.extend(customParseFormat);

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

export interface DatepickerDateRange {
  from: string;
  to: string;
}

interface PureDatepickerProps {
  label: string;
  errorMessage?: string;
  ariaLabel?: string;
  inputId?: string;
  disabled?: boolean;
  disabledDays?: {
    from: Date;
    to?: Date;
  }[];
  fromDate?: Date;
  toDate?: Date;
  initialMonth?: Date;
  /**
   * @deprecated Bruk disabledDays, fromDate og toDate istedet.
   */
  limitations?: DatepickerLimitations;
  onChange?: (value: any) => void;
  value: string | Date;
  hideLabel?: boolean;
}

const PureDatepicker = ({
  label,
  value,
  onChange,
  errorMessage,
  limitations,
  inputId,
  disabled,
  initialMonth,
  fromDate,
  toDate,
  disabledDays,
  ariaLabel,
  hideLabel,
}: PureDatepickerProps): JSX.Element => {
  const stringToDate = (date: string | Date): Date => {
    const newDate = dayjs(date, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT, 'YYYY.MM.DD'], true);
    return newDate.isValid() ? newDate.toDate() : undefined;
  };
  const [ugyldigDatoError, setUgyldigDatoError] = React.useState(false);

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: limitations && limitations.minDate ? new Date(limitations.minDate) : fromDate,
    toDate: limitations && limitations.maxDate ? new Date(limitations.maxDate) : toDate,
    defaultMonth: initialMonth ? new Date(initialMonth) : undefined,
    defaultSelected: value ? stringToDate(value) : undefined,
    disabled:
      limitations && limitations.invalidDateRanges
        ? limitations.invalidDateRanges.map(range => ({
            from: stringToDate(range.from),
            to: stringToDate(range.to),
          }))
        : disabledDays,
    onDateChange: date => {
      if (date) {
        const verdi = dayjs(date).format(ISO_DATE_FORMAT);
        onChange(verdi);
      }
    },
    onValidate: date => {
      setUgyldigDatoError(date.isBefore || date.isAfter);
    },
  });

  return (
    <div className={styles.datepicker}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          hideLabel={hideLabel || !label}
          label={label}
          id={inputId}
          disabled={disabled}
          size="small"
          error={errorMessage || (ugyldigDatoError ? 'Du har valgt en dato som er utenfor gyldig periode.' : undefined)}
          aria-label={ariaLabel}
        />
      </DatePicker>
    </div>
  );
};

export default PureDatepicker;
