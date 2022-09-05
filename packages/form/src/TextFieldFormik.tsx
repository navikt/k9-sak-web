import { TextField } from '@navikt/ds-react';
import { connect, Field as FormikField, FormikState, getIn } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { validateAll } from './formikUtils';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';

interface TextFieldFormikProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => null | any)[];
  readOnly?: boolean;
  dataId?: string;
  maxLength?: number;
  placeholder?: string;
  formik: FormikState<any>;
}

const renderTextField = ({ field: { value, name }, form, label, maxLength, touched, error, intl, disabled }) => {
  const { id, ...intlParams } = error ?? {};

  return (
    <TextField
      value={value}
      onChange={form.handleChange(name)}
      onBlur={form.handleBlur(name)}
      disabled={disabled}
      label={label}
      error={touched && error ? intl.formatMessage({ id }, { ...intlParams }) : null}
      maxLength={maxLength}
      size="small"
    />
  );
};

const TextFieldFormik = ({ name, label, validate, readOnly, formik, ...otherProps }: TextFieldFormikProps) => {
  const intl = useIntl();
  return (
    <FormikField
      name={name}
      validate={value => validateAll(validate, value)}
      component={readOnly ? ReadOnlyField : renderTextField}
      label={label}
      error={getIn(formik.errors, name)}
      touched={getIn(formik.touched, name)}
      {...otherProps}
      disabled={readOnly}
      readOnlyHideEmpty
      autoComplete="off"
      type="textarea"
      intl={intl}
    />
  );
};

export default connect(TextFieldFormik);
