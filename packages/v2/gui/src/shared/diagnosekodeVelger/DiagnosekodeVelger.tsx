import React, { useState, useEffect, useCallback } from 'react';
import { UNSAFE_Combobox, type ComboboxProps } from '@navikt/ds-react';
import { ICD10 } from '@navikt/diagnosekoder';
import { useFormContext } from 'react-hook-form';
interface DiagnosekodeVelgerProps extends Pick<ComboboxProps, 'size' | 'className' | 'disabled'> {
  label?: string;
  name: string;
}

const MIN_SEARCH_CHARS = 3;

const DiagnosekodeVelger: React.FC<DiagnosekodeVelgerProps> = ({
  name,
  size,
  className,
  disabled,
  label = 'Diagnosekoder',
}) => {
  const { register, watch, setValue, trigger, formState } = useFormContext();
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<{ key: string; label: string; value: string }[]>([]);

  register(name, {
    validate: value => (value.length > 0 ? undefined : 'Diagnosekode er påkrevd'),
  });

  const onChange = (value: string[]) => {
    setValue(name, value);
    void trigger(name);
  };

  const watchValue = watch(name);

  const getFullOptions = useCallback(() => {
    return ICD10.map(v => ({
      key: v.code,
      label: `${v.code} - ${v.text}`,
      value: v.code,
    }));
  }, []);

  useEffect(() => {
    const filterResults = async () => {
      if (searchValue.length >= MIN_SEARCH_CHARS) {
        const query = searchValue.toLowerCase();
        const filtered = getFullOptions().filter(
          opt => opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query),
        );
        setFilteredOptions(filtered.slice(0, 150));
      } else {
        setFilteredOptions([]);
      }
    };

    void filterResults();
  }, [searchValue, getFullOptions]);

  const handleOnChange = (newValue: string) => {
    if (watchValue?.includes(newValue)) {
      onChange(watchValue.filter((code: string) => code !== newValue));
    } else {
      onChange(watchValue.concat(newValue));
    }
    setSearchValue('');
  };

  return (
    <div>
      <UNSAFE_Combobox
        label={label}
        name={name}
        isMultiSelect
        size={size}
        className={className}
        options={filteredOptions}
        onToggleSelected={handleOnChange}
        onChange={setSearchValue}
        value={searchValue}
        selectedOptions={getFullOptions().filter(opt => watchValue.includes(opt.value))}
        shouldAutocomplete
        disabled={disabled}
        error={formState.errors[name]?.message as string | undefined}
      />
    </div>
  );
};

export default DiagnosekodeVelger;
