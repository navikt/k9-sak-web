import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Field } from 'redux-form';
import renderNavField from './renderNavField';
import LabelType from './LabelType';

interface CheckboxFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
}

interface RenderCheckboxFieldProps {
  onChange: (isChecked: boolean) => void;
  label: React.ReactElement;
  value: string | number | string[];
  isEdited: boolean;
}

export const RenderCheckboxField = renderNavField(({ onChange, label, ...otherProps }: RenderCheckboxFieldProps) => {
  // eslint-disable-next-line no-param-reassign
  delete otherProps.isEdited;
  return (
    <NavCheckbox
      onChange={event => onChange(event.target.checked)}
      checked={!!otherProps.value}
      label={React.cloneElement(label, { typographyElement: Normaltekst })}
      {...otherProps}
    />
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
