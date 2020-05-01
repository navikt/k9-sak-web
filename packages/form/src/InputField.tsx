import { Input as NavInput, InputProps as NavFrontendInputProps } from 'nav-frontend-skjema';
import React from 'react';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField, { ReadOnlyFieldProps } from './ReadOnlyField';
import renderNavField from './renderNavField';

const renderNavInput = renderNavField(NavInput);

interface InputFieldProps {
  name: string;
  type?: string;
  label?: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
  isEdited?: boolean;
}

const InputField = ({
  name,
  type,
  label,
  validate,
  readOnly,
  isEdited,
  ...otherProps
}: InputFieldProps & (NavFrontendInputProps | ReadOnlyFieldProps)) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderNavInput}
    type={type}
    label={label}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
    autoComplete="off"
  />
);

InputField.defaultProps = {
  type: 'text',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
};

export default InputField;
