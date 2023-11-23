import { ErrorMessage } from '@hookform/error-message';
import { Checkbox, CheckboxGroup as DSCheckboxGroup } from '@navikt/ds-react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

interface CheckboxGroupProps {
  question: string;
  name: string;
  checkboxes: { value: string; label: string | React.ReactNode }[];
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  disabled?: boolean;
}

const CheckboxGroup = ({ question, checkboxes, name, validators, disabled }: CheckboxGroupProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({
    control,
    name,
    rules: {
      validate: {
        ...validators,
      },
    },
  });

  return (
    <DSCheckboxGroup
      name={name}
      legend={question}
      error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
      size="small"
      onChange={value => {
        field.onChange(value);
      }}
      value={field.value !== undefined ? field.value : []}
    >
      {checkboxes.map(checkboxProps => (
        <Checkbox key={checkboxProps.value} value={checkboxProps.value} disabled={disabled}>
          {checkboxProps.label}
        </Checkbox>
      ))}
    </DSCheckboxGroup>
  );
};

export default CheckboxGroup;
