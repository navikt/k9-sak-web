// react hook form wrapper for datovelger

import { useController, useFormContext } from 'react-hook-form';
import DatovelgerPlain from './DatovelgerPlain';

const Datovelger = ({
  name,
  label,
  disabled,
  fromDate,
  toDate,
  size,
  validators,
  showErrorMessage = true,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  size?: 'small' | 'medium';
  validators?: ((value: string) => string | undefined)[];
  showErrorMessage?: boolean;
}) => {
  const formMethods = useFormContext();
  const controller = useController({
    control: formMethods.control,
    name: name,
    rules: {
      validate: validators?.reduce((acc, validator, index) => ({ ...acc, [index]: validator }), {}),
    },
  });
  const { field } = controller;
  const { value } = field;
  const onChange = (newValue: string) => {
    field.onChange(newValue);
  };
  const error = formMethods.formState.errors[name]?.message as string | undefined;
  return (
    <DatovelgerPlain
      label={label}
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
