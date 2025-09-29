import React, { useState, useEffect, useMemo } from 'react';
import { UNSAFE_Combobox, type ComboboxProps } from '@navikt/ds-react';
import { type ICD10Diagnosekode } from '@navikt/diagnosekoder';
import { useFormContext } from 'react-hook-form';
import { initDiagnosekodeSearcher } from './diagnosekodeSearcher.js';

interface DiagnosekodeVelgerProps extends Pick<ComboboxProps, 'size' | 'className' | 'disabled'> {
  label?: string;
  name: string;
  description?: string;
}

const MIN_SEARCH_CHARS = 0;

const diagnosekodeSearcher = initDiagnosekodeSearcher(50);

type ComboBoxOptions = Readonly<{ key: string; label: string; value: string }>;

const diagnosekodeToComboBoxOption = (diagnosekode: ICD10Diagnosekode): ComboBoxOptions => ({
  key: diagnosekode.code,
  label: `${diagnosekode.code} - ${diagnosekode.text}`,
  value: diagnosekode.code,
});

const DiagnosekodeVelger: React.FC<DiagnosekodeVelgerProps> = ({
  name,
  size,
  description,
  className,
  disabled,
  label = 'Diagnosekoder',
}) => {
  const { register, watch, setValue, trigger, formState } = useFormContext<{ [key: string]: string[] }>();
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOptions[]>([]);

  register(name, {
    validate: !disabled ? value => (value.length > 0 ? undefined : 'Diagnosekode er påkrevd') : undefined,
  });

  useEffect(() => {
    if (disabled) {
      setValue(name, []);
    }
  }, [disabled, name, setValue]);

  const onChange = (value: string[]) => {
    setValue(name, value);
    void trigger(name);
  };

  const watchValue = watch(name);

  useEffect(() => {
    const search = async () => {
      if (searchValue.length >= MIN_SEARCH_CHARS) {
        const query = searchValue.toLowerCase();
        const { diagnosekoder } = diagnosekodeSearcher.search(query, 1);
        setFilteredOptions(diagnosekoder.map(diagnosekodeToComboBoxOption));
      } else {
        setFilteredOptions([]);
      }
    };
    void search();
  }, [searchValue]);

  const handleOnChange = (newValue: string) => {
    const existsIdx = watchValue.findIndex(v => v.toUpperCase() === newValue.toUpperCase());
    if (existsIdx >= 0) {
      onChange(watchValue.toSpliced(existsIdx, 1));
    } else {
      onChange([...watchValue, newValue]);
    }
    setSearchValue('');
  };

  const selectedOptions = useMemo(() => {
    const upperCasedValues = watchValue.map(v => v.toUpperCase());
    const found = diagnosekodeSearcher.diagnosekoderAndUppercased
      .filter(dk => upperCasedValues.includes(dk.uppercased.code))
      .map(v => diagnosekodeToComboBoxOption(v.diagnosekode));

    const notFound = upperCasedValues
      .filter(v => !found.some(f => f.value === v))
      .map(v => ({ key: v, label: `${v} - Ukjent diagnosekode`, value: v }));
    return [...found, ...notFound];
  }, [watchValue]);

  return (
    <div>
      <UNSAFE_Combobox
        label={label}
        description={description}
        name={name}
        isMultiSelect
        size={size}
        className={className}
        options={filteredOptions}
        onToggleSelected={handleOnChange}
        onChange={setSearchValue}
        value={searchValue}
        selectedOptions={selectedOptions}
        disabled={disabled}
        error={formState.errors[name]?.message as string | undefined}
      />
    </div>
  );
};

export default DiagnosekodeVelger;
