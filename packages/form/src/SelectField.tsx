import React, { ReactNode } from 'react';
import { Field } from 'redux-form';
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
  ({ input, selectValues, disabled, hideValueOnDisable, ...otherProps }) => {
    /* eslint-disable-next-line react/prop-types */
    const option = selectValues.map(sv => sv.props).find(o => o.value === input.value);
    let value = option ? option.children : undefined;
    // For å få nokolunde samme oppførsel som "opprinneleg komponent" på readonly komponenten når disabled og hideValueOnDisable
    // er satt, legger vi inn value som eit tomt mellomrom i dette tilfellet. Dette sidan viss vi setter value til null, undefined
    // eller "", så returnerer ReadOnlyField null, så heile input feltet med label forsvinner.
    const hideValue = hideValueOnDisable === true && disabled === true;
    if (hideValue) {
      value = <>&nbsp;</>;
    }
    return <ReadOnlyField input={{ value }} {...otherProps} />;
  };

const renderNavSelect = renderNavField(CustomNavSelect);

const SelectField = ({
  name,
  label,
  selectValues,
  validate = null,
  readOnly = false,
  hideValueOnDisable = false,
  disabled,
  placeholder = ' ',
  ...otherProps
}: SelectFieldProps) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? renderReadOnly() : renderNavSelect}
    label={label}
    selectValues={selectValues}
    disabled={disabled === true}
    hideValueOnDisable={hideValueOnDisable}
    {...otherProps}
    readOnly={readOnly}
    // @ts-ignore TODO Fiks
    readOnlyHideEmpty
    placeholder={placeholder}
  />
);

export default SelectField;
