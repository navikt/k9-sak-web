import { Field } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';

import { Checkbox as NavCheckbox } from '@navikt/ds-react';

import LabelType from './LabelType';
import { validateAll } from './formikUtils';

interface CheckboxFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => string | undefined)[] | ((value: string) => string | undefined);
  disabled?: boolean;
}

interface RenderCheckboxFieldProps {
  label: { id: string };
  value: boolean;
  field: any;
  disabled: boolean;
}

export const RenderCheckboxField = ({
  label,
  disabled,
  field: { onChange, value, name },
}: RenderCheckboxFieldProps) => {
  const intl = useIntl();
  return (
    <NavCheckbox onChange={onChange(name)} checked={value} disabled={disabled} size="small" value={value}>
      {intl.formatMessage(label)}
    </NavCheckbox>
  );
};

const CheckboxFieldFormik = ({ name, label, disabled, validate = [] }: CheckboxFieldProps) => (
  <Field
    name={name}
    key={name}
    validate={value => validateAll(validate, value)}
    component={RenderCheckboxField}
    label={label}
    disabled={disabled}
  />
);

export default CheckboxFieldFormik;
