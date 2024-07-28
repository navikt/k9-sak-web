import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@navikt/ds-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getError } from './formUtils';

interface TextAreaProps {
  label?: React.ReactNode;
  name: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  helptext?: string;
  textareaClass?: string;
  id?: string;
  disabled?: boolean;
}

const TextArea = ({ label, name, validators, textareaClass, id, disabled }: TextAreaProps): JSX.Element => {
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
        return (
          <Textarea
            value={textAreaValue}
            label={label}
            maxLength={0}
            error={getError(errors, name) && <ErrorMessage errors={errors} name={name} />}
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
