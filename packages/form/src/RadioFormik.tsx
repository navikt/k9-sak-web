import React from 'react';
import { Radio, RadioProps } from '@navikt/ds-react';
import { useField } from 'formik';

interface OwnProps extends RadioProps {
  name: string;
}

const RadioFormik = ({ children, name, value, ...props }: OwnProps) => {
  const [field] = useField({ name, type: 'radio', value });
  return (
    <Radio {...field} {...props}>
      {children}
    </Radio>
  );
};

export default RadioFormik;
