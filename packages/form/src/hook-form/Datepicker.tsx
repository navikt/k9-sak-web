import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatepickerLimitations } from '../DatepickerLimitations';
import PureDatepicker from '../PureDatepicker';

export interface DatepickerProps {
  label?: string;
  name: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  ariaLabel?: string;
  defaultValue?: string;
  fromDate?: Date;
  toDate?: Date;
  /**
   * @deprecated Bruk disabledDays, fromDate og toDate istedet.
   */
  limitations?: DatepickerLimitations;
  error?: string;
  inputId?: string;
  disabled?: boolean;
  disabledDays?: {
    from: Date;
    to?: Date;
  }[];
}

const Datepicker = ({
  name,
  validators,
  limitations,
  label,
  ariaLabel,
  defaultValue,
  error,
  inputId,
  disabled,
  fromDate,
  toDate,
  disabledDays,
}: DatepickerProps): JSX.Element => {
  const { control, formState } = useFormContext();
  const { errors } = formState;

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
          <PureDatepicker
            label={label}
            onChange={onChange}
            value={value}
            errorMessage={error || (errors[name]?.message as string)}
            limitations={limitations}
            ariaLabel={ariaLabel}
            inputId={inputId}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
            disabledDays={disabledDays}
          />
        );
      }}
    />
  );
};

export default Datepicker;
