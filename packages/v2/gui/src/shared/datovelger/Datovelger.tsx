// react hook form wrapper for datovelger

import { useController, useFormContext } from 'react-hook-form';
import DatovelgerPlain from './DatovelgerPlain';

const Datovelger = ({
  name,
  label,
  hideLabel,
  disabled,
  fromDate,
  toDate,
  size,
  validate,
  showErrorMessage = true,
}: {
  name: string;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  size?: 'small' | 'medium';
  validate?: ((value: string) => string | null | undefined)[];
  showErrorMessage?: boolean;
}) => {
  const formMethods = useFormContext();
  const controller = useController({
    control: formMethods.control,
    name: name,
    rules: {
      validate: validate?.reduce((acc, validator, index) => ({ ...acc, [index]: validator }), {}),
    },
  });
  const { field, fieldState } = controller;
  const { value } = field;
  const onChange = (newValue: string) => {
    field.onChange(newValue);
    void formMethods.trigger(name);
  };
  const error = fieldState.error?.message as string | undefined;
  return (
    <DatovelgerPlain
      label={label}
      hideLabel={hideLabel}
      value={value}
      onChange={onChange}
      disabled={disabled}
      errorMessage={showErrorMessage ? error : !!error}
      selectedDay={value}
      onBlur={() => {
        field.onBlur();
      }}
      fromDate={fromDate}
      toDate={toDate}
      size={size}
    />
  );
};

export default Datovelger;
