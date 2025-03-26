import React, { useState, useEffect, useCallback } from 'react';
import { UNSAFE_Combobox, type ComboboxProps } from '@navikt/ds-react';
import { ICD10 } from '@navikt/diagnosekoder';

interface DiagnosekodeVelgerProps extends Pick<ComboboxProps, 'size' | 'className' | 'disabled'> {
  label?: string;
  name: string;
  onChange: (value: string[]) => void;
  value: string[];
}

const MIN_SEARCH_CHARS = 3;

const DiagnosekodeVelger: React.FC<DiagnosekodeVelgerProps> = ({
  name,
  onChange,
  size,
  className,
  disabled,
  value = [],
  label = 'Diagnosekoder',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<{ key: string; label: string; value: string }[]>([]);

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
    if (value?.includes(newValue)) {
      onChange?.(value.filter(code => code !== newValue));
    } else {
      onChange?.(value.concat(newValue));
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
        selectedOptions={getFullOptions().filter(opt => value.includes(opt.value))}
        shouldAutocomplete
        disabled={disabled}
      />
    </div>
  );
};

export default DiagnosekodeVelger;
