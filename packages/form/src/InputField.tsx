import { TextField, TextFieldProps } from '@navikt/ds-react';
import React from 'react';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField, { ReadOnlyFieldProps } from './ReadOnlyField';
import renderNavField from './renderNavField';

const renderNavInput = renderNavField(TextField);

interface InputFieldProps {
  name: string;
  type?: string;
  label?: LabelType;
  validate?: (
    | ((text: any) => ({ id: string; length?: undefined } | { length: any; id?: undefined })[])
    | ((value: any, allValues: any, props: any) => { id: string }[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined } | { text: any; id?: undefined })[])
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
  type,
  label,
  validate,
  readOnly,
  isEdited,
  ...otherProps
}: InputFieldProps & (TextFieldProps | ReadOnlyFieldProps)) => (
  <Field
    name={name}
    validate={validate}
    // @ts-ignore TODO Fiks
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
  size: 'small',
};

export default InputField;
