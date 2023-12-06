import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@navikt/ds-react';
import { Box, ExpandableLabel, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface TextAreaProps {
  label?: React.ReactNode;
  name: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  helptext?: string;
  textareaClass?: string;
  id?: string;
  disabled?: boolean;
}

const TextArea = ({ label, name, validators, helptext, textareaClass, id, disabled }: TextAreaProps): JSX.Element => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        validate: {
          ...validators,
        },
      }}
      render={({ field }) => {
        const { value, onChange } = field;
        const textAreaValue = value?.length === 0 ? '' : value;

        if (helptext) {
          return (
            <>
              <ExpandableLabel labelText={label} helptext={helptext} labelFor={name} />
              <Box marginTop={Margin.medium}>
                <Textarea
                  value={textAreaValue}
                  maxLength={0}
                  error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
                  name={name}
                  onChange={onChange}
                  id={id}
                  className={textareaClass}
                  autoComplete="off"
                  disabled={disabled}
                  size="small"
                  label={label}
                  hideLabel
                />
              </Box>
            </>
          );
        }
        return (
          <Textarea
            value={textAreaValue}
            label={label}
            maxLength={0}
            error={errors[name]?.message && <ErrorMessage errors={errors} name={name} />}
            id={id}
            name={name}
            onChange={onChange}
            className={textareaClass}
            autoComplete="off"
            disabled={disabled}
            size="small"
          />
        );
      }}
    />
  );
};

export default TextArea;
