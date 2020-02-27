import React from 'react';
import { Element } from 'nav-frontend-typografi';
import { Field, WrappedFieldInputProps } from 'redux-form';
// eslint-disable-next-line import/no-named-default
import { default as NAPAutocomplete } from '@navikt/nap-autocomplete';
import { Suggestion as NAPSuggestion } from '@navikt/nap-autocomplete/dist/types/Suggestion';
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
  suggestions: NAPSuggestion[];
  readOnly: boolean;
  onInputValueChange: (searchString: string) => void;
  inputValue: string;
  name: string;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  dataId?: string;
}

const Autocomplete = ({
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
}: AutocompleteFieldProps & AutocompleteProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="skjemaelement__label" htmlFor={id} data-id={dataId}>
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
};

const AutocompleteField = (props: AutocompleteProps) => {
  const { readOnly } = props;
  return <Field {...props} component={readOnly ? ReadOnlyField : Autocomplete} />;
};

export default AutocompleteField;
