import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Field, WrappedFieldInputProps } from 'redux-form';
// eslint-disable-next-line import/no-named-default
import { Autocomplete as NAPAutocomplete } from '@navikt/k9-react-components';
import ReadOnlyField from './ReadOnlyField';
import styles from './autocompleteField.less';

interface AutocompleteFieldProps {
  onChange: () => void;
  value: string;
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
  validate?: ((value: string) => boolean | undefined | { id: string }[])[] | ((value: string) => boolean | undefined);
  dataId?: string;
}

const Autocomplete: FunctionComponent<AutocompleteFieldProps & AutocompleteProps> = ({
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
}) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label htmlFor={id} className={styles.autocompleteLabel} data-id={dataId}>
    <Element className={styles.typoElement}>{label}</Element>
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
