import React, { ReactNode } from 'react';
import { Field } from 'formik';
import CustomNavSelect from './CustomNavSelect';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

interface SelectFieldProps {
  name: string;
  selectValues: any[];
  label: LabelType;
  validate?: (
    | ((text: any) => ({ id: string; length?: undefined } | { length: any; id?: undefined })[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined } | { text: any; id?: undefined })[])
  )[];
  readOnly?: boolean;
  placeholder?: string;
  hideValueOnDisable?: boolean;
  bredde?: string;
  disabled?: boolean;
  onChange?: (elmt: ReactNode, value: any) => void;
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

const renderNavSelect = renderNavField(CustomNavSelect);

const SelectFieldFormik = ({ name, label, selectValues, validate, readOnly, ...otherProps }: SelectFieldProps) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? renderReadOnly() : renderNavSelect}
    label={label}
    selectValues={selectValues}
    disabled={!!readOnly}
    {...otherProps}
    readOnly={readOnly}
    // @ts-ignore TODO Fiks
    readOnlyHideEmpty
  />
);

SelectFieldFormik.defaultProps = {
  validate: null,
  readOnly: false,
  placeholder: ' ',
  hideValueOnDisable: false,
};

export default SelectFieldFormik;
