import { Radio, RadioGroup } from '@navikt/ds-react';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface RadioProps {
  value: string;
  label: React.ReactNode;
  id?: string;
}

interface RadioGroupPanelProps {
  question: React.ReactNode;
  name: string;
  radios: RadioProps[];
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  onChange?: (value) => void;
  disabled?: boolean;
}

const RadioGroupPanel = ({ question, name, validators, radios, onChange, disabled }: RadioGroupPanelProps) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const customOnChange = onChange;
  return (
    <Controller
      control={control}
      defaultValue={null}
      name={name}
      rules={{
        validate: {
          ...validators,
        },
      }}
      render={props => {
        const reactHookFormOnChange = props.field.onChange;
        return (
          <RadioGroup
            legend={question}
            error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
            size="small"
          >
            {radios.map(radio => (
              <Radio
                key={radio.value}
                id={radio.id || radio.value}
                name={name}
                onChange={() => {
                  if (customOnChange) {
                    customOnChange(radio.value);
                  }
                  reactHookFormOnChange(radio.value);
                }}
                checked={radio.value === props.field.value}
                disabled={disabled}
                value={radio.value}
              >
                {radio.label}
              </Radio>
            ))}
          </RadioGroup>
        );
      }}
    />
  );
};

export default RadioGroupPanel;
