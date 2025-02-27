import { Checkbox } from '@navikt/ds-react';

import React from 'react';
import { Field } from 'redux-form';
import Label from './Label';
import LabelType from './LabelType';
import renderNavField from './renderNavField';

interface CheckboxFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
}

interface RenderCheckboxFieldProps {
  onChange: (isChecked: boolean) => void;
  label: React.ReactElement<any>;
  value: string | number | string[];
  isEdited: boolean;
}

export const RenderCheckboxField = renderNavField(({ onChange, label, ...otherProps }: RenderCheckboxFieldProps) => {
  // eslint-disable-next-line no-param-reassign
  delete otherProps.isEdited;
  return (
    <Checkbox
      onChange={event => onChange(event.target.checked)}
      checked={!!otherProps.value}
      size="small"
      {...otherProps}
    >
      <Label input={label} textOnly />
    </Checkbox>
  );
});

const CheckboxField = ({ name, label, validate, readOnly, ...otherProps }: CheckboxFieldProps) => (
  <Field
    name={name}
    validate={validate}
    component={RenderCheckboxField}
    label={label}
    disabled={readOnly}
    readOnly={readOnly}
    readOnlyHideEmpty
    {...otherProps}
  />
);

export default CheckboxField;
