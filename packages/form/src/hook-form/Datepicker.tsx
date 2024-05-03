import { Datepicker as SharedDatepicker } from '@k9-sak-web/shared-components';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface DatepickerProps {
  label?: string;
  name: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  defaultValue?: string;
  fromDate?: Date;
  toDate?: Date;
  error?: string;
  inputId?: string;
  disabled?: boolean;
}

const Datepicker = ({
  name,
  validators,
  label,
  defaultValue,
  error,
  inputId,
  disabled,
  fromDate,
  toDate,
}: DatepickerProps): JSX.Element => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const disabledDays = { before: fromDate, after: toDate };
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: {
          ...validators,
        },
      }}
      defaultValue={defaultValue}
      render={({ field }) => {
        const { onChange, value } = field;
        return (
          <SharedDatepicker
            label={label}
            onChange={onChange}
            value={value}
            error={error || (errors[name]?.message as string)}
            inputId={inputId}
            disabled={disabled}
            disabledDays={disabledDays}
          />
        );
      }}
    />
  );
};

export default Datepicker;
