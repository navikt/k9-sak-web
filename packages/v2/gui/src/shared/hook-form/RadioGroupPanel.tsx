import { ErrorMessage } from '@hookform/error-message';
import { Radio, RadioGroup } from '@navikt/ds-react';
import React, { type ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getError } from './formUtils';

interface RadioProps {
  value: string;
  label: React.ReactNode;
  id?: string;
  element?: ReactElement;
}

interface RadioGroupPanelProps {
  question: React.ReactNode;
  name: string;
  radios: RadioProps[];
  validators?: Record<string, (value: string | number | boolean) => any>;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const RadioGroupPanel = ({
  question,
  name,
  validators,
  radios,
  onChange,
  disabled,
  readOnly,
}: RadioGroupPanelProps) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const customOnChange = onChange;
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: validators,
      }}
      render={({ field }) => {
        const reactHookFormOnChange = field.onChange;
        const valueToString = `${field.value}`;
        return (
          <RadioGroup
            legend={question}
            error={getError(errors, name) && <ErrorMessage errors={errors} name={name} />}
            size="small"
            readOnly={readOnly}
            value={valueToString}
          >
            {radios.map(radio => (
              <React.Fragment key={radio.value}>
                <Radio
                  id={radio.id || radio.value}
                  name={name}
                  onChange={() => {
                    if (customOnChange) {
                      customOnChange(radio.value);
                    }
                    reactHookFormOnChange(radio.value);
                  }}
                  disabled={disabled}
                  value={radio.value}
                >
                  {radio.label}
                </Radio>
                {radio.value === field.value && radio.element}
              </React.Fragment>
            ))}
          </RadioGroup>
        );
      }}
    />
  );
};

export default RadioGroupPanel;
