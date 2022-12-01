import React from 'react';
import { RadioGroup, RadioGroupProps } from '@navikt/ds-react';
import { useField } from 'formik';
import RadioFormik from './RadioFormik';

interface OwnProps extends Partial<RadioGroupProps> {
  name: string;
  options?: { label: string; value: string }[];
}

const RadioGroupFormik = ({ name, options, legend, children, ...props }: OwnProps) => {
  const [field, meta] = useField(name);

  if (children) {
    return (
      <RadioGroup legend={legend} error={meta.touched && meta.error} {...field} {...props}>
        {children}
      </RadioGroup>
    );
  }
  return (
    <RadioGroup legend={legend} error={meta.touched && meta.error} {...field} {...props}>
      {options?.map(option => (
        <RadioFormik key={option.value} name={field.name} value={option.value}>
          {option.label}
        </RadioFormik>
      ))}
    </RadioGroup>
  );
};

export default RadioGroupFormik;
