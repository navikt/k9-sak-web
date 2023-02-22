import React from 'react';
import { RadioGroup, RadioGroupProps } from '@navikt/ds-react';
import { useField } from 'formik';
import { useIntl } from 'react-intl';
import RadioFormik from './RadioFormik';
import { validateAll } from './formikUtils';

interface OwnProps extends Partial<RadioGroupProps> {
  name: string;
  options?: { label: string; value: string }[];
  validate?: ((value: string) => null | any)[];
}

const RadioGroupFormik = ({ name, options, legend, children, validate, ...props }: OwnProps) => {
  const [field, meta] = useField({ name, validate: value => validateAll(validate, value) });
  const intl = useIntl();

  const error = meta.error ? intl.formatMessage(meta.error as any) : null;
  if (children) {
    return (
      <RadioGroup legend={legend} error={meta.touched && error} {...field} {...props}>
        {children}
      </RadioGroup>
    );
  }
  return (
    <RadioGroup size="small" legend={legend} error={meta.touched && error} {...field} {...props}>
      {options?.map(option => (
        <RadioFormik key={option.value} name={field.name} value={option.value}>
          {option.label}
        </RadioFormik>
      ))}
    </RadioGroup>
  );
};

export default RadioGroupFormik;
