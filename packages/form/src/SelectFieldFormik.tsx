import { Field } from 'formik';
import React, { ReactNode } from 'react';
import CustomNavSelect from './CustomNavSelect';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import { validateAll } from './formikUtils';

interface SelectFieldProps {
  name: string;
  selectValues: any[];
  label: LabelType;
  validate?: ((value: string) => null | any)[];
  readOnly?: boolean;
  placeholder?: string;
  hideValueOnDisable?: boolean;
  bredde?: string;
  disabled?: boolean;
  onChange?: (elmt: ReactNode, value: any) => void;
  className?: string;
}

/* eslint-disable-next-line react/prop-types */
const renderReadOnly =
  () =>
  ({ field, selectValues, ...otherProps }) => {
    /* eslint-disable-next-line react/prop-types */
    const option = selectValues.map(sv => sv.props).find(o => o.value === field.value);
    const value = option ? option.children : undefined;
    return <ReadOnlyField input={{ value }} {...otherProps} />;
  };

const renderNavSelect = ({ label, selectValues, field, ...props }) => (
  <CustomNavSelect selectValues={selectValues} label={label} {...field} {...props} />
);

const SelectFieldFormik = ({
  name,
  label,
  selectValues,
  validate = null,
  readOnly = false,
  placeholder = ' ',
  hideValueOnDisable = false,
  ...otherProps
}: SelectFieldProps) => (
  <Field
    name={name}
    validate={value => validateAll(validate, value)}
    component={readOnly ? renderReadOnly() : renderNavSelect}
    label={label}
    selectValues={selectValues}
    disabled={!!readOnly}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    placeholder={placeholder}
    hideValueOnDisable={hideValueOnDisable}
  />
);

export default SelectFieldFormik;
