import { PureDatepicker } from '@k9-sak-web/form';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface OwnProps {
  titel: string;
  navn: `${string}`;
  valideringsFunksjoner;
  begrensningerIKalender?: { invalidDateRanges: { from: string; to: string }[]; minDate: string; maxDate: string };
  disabled?: boolean;
}

const DatePicker: React.FunctionComponent<OwnProps> = ({
  titel,
  navn,
  valideringsFunksjoner,
  begrensningerIKalender,
  disabled = false,
}) => {
  const { control } = useFormContext();
  const stringToDate = (date: string | Date): Date => new Date(date);
  const fraDato = begrensningerIKalender?.minDate ? new Date(begrensningerIKalender.minDate) : undefined;
  const tilDato = begrensningerIKalender?.maxDate ? new Date(begrensningerIKalender.maxDate) : undefined;
  const disabledDays = begrensningerIKalender?.invalidDateRanges?.map(range => ({
    from: stringToDate(range.from),
    to: stringToDate(range.to),
  }));
  return (
    <div>
      <Controller
        control={control}
        name={navn}
        rules={{
          validate: valideringsFunksjoner,
        }}
        render={({ field: { onChange, value } }) => (
          <PureDatepicker
            label={titel}
            onChange={onChange}
            value={value}
            disabledDays={disabledDays}
            fromDate={fraDato}
            toDate={tilDato}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
};

export default DatePicker;
