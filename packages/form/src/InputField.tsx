import { TextField, TextFieldProps } from '@navikt/ds-react';
import React from 'react';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField, { ReadOnlyFieldProps } from './ReadOnlyField';
import renderNavField from './renderNavField';
import { ValidationReturnType } from '@fpsak-frontend/utils/src/validation/validators';

const renderNavInput = renderNavField(TextField);

interface InputFieldProps {
  name: string;
  type?: string;
  label?: LabelType;
  validate?: (
    | ((value: string) => ValidationReturnType)
    | ((value: string, allValues) => ValidationReturnType)
  )[];
  readOnly?: boolean;
  isEdited?: boolean;
  renderReadOnlyValue?: (value: any) => any;
  parse?: (value: string) => string | number;
  format?: (value: string) => string | number;
  size?: 'medium' | 'small';
}

const InputField = ({
  name,
  type = 'text',
  label = '',
  validate = undefined,
  readOnly = false,
  isEdited = false,
  size = 'small',
  ...otherProps
}: InputFieldProps & (TextFieldProps | ReadOnlyFieldProps)) => (
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
    size={size}
  />
);

export default InputField;
