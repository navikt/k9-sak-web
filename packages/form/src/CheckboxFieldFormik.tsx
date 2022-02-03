import React from 'react';
import { Field } from 'formik';
import { useIntl } from 'react-intl';

import { Checkbox as NavCheckbox } from '@navikt/ds-react';

import LabelType from './LabelType';
import { validateAll } from './formikUtils';

interface CheckboxFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
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
    <NavCheckbox onChange={onChange(name)} checked={value} disabled={disabled} size="small">
      {intl.formatMessage(label)}
    </NavCheckbox>
  );
};

const CheckboxFieldFormik = ({ name, label, readOnly, validate = [] }: CheckboxFieldProps) => (
  <Field
    name={name}
    key={name}
    validate={value => validateAll(validate, value)}
    component={RenderCheckboxField}
    label={label}
    disabled={readOnly}
  />
);

export default CheckboxFieldFormik;
