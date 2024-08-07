import { Label } from '@navikt/ds-react';
import React from 'react';
import { Field, WrappedFieldInputProps } from 'redux-form';
import { Autocomplete as NAPAutocomplete } from '@navikt/ft-plattform-komponenter';
import ReadOnlyField from './ReadOnlyField';
import styles from './autocompleteField.module.css';

interface AutocompleteFieldProps {
  onChange: () => void;
  input: WrappedFieldInputProps;
}

interface AutocompleteProps {
  id: string;
  label: string;
  ariaLabel: string;
  placeholder: string;
  suggestions: any[];
  readOnly: boolean;
  onInputValueChange: (searchString: string) => void;
  inputValue: string;
  name: string;
  dataId?: string;
}

const Autocomplete = (
  {
    id,
    ariaLabel,
    label,
    suggestions,
    placeholder,
    name,
    onInputValueChange,
    inputValue,
    input: { onChange },
    dataId,
  }: AutocompleteFieldProps & Partial<AutocompleteProps>, // eslint-disable-next-line jsx-a11y/label-has-associated-control
) => (
  <label htmlFor={id} className={styles.autocompleteLabel} data-id={dataId}>
    <Label size="small" as="p" className={styles.typoElement}>
      {label}
    </Label>
    <NAPAutocomplete
      id={id}
      suggestions={suggestions}
      value={inputValue}
      onChange={onInputValueChange}
      onSelect={e => {
        onChange(e);
        onInputValueChange(e.value);
      }}
      ariaLabel={ariaLabel}
      placeholder={placeholder}
      name={name}
    />
  </label>
);

const AutocompleteField = (props: AutocompleteProps) => {
  const { readOnly } = props;
  return <Field {...props} component={readOnly ? ReadOnlyField : Autocomplete} />;
};

export default AutocompleteField;
