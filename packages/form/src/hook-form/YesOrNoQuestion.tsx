import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PureYesOrNoQuestion from './pure/PureYesOrNoQuestion';

interface YesOrNoQuestionProps {
  question: string;
  name: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  disabled?: boolean;
}

const YesOrNoQuestion = ({ question, name, validators, disabled }: YesOrNoQuestionProps) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null}
      rules={{
        validate: {
          ...validators,
        },
      }}
      render={({ field }) => {
        const { value, onChange } = field;
        return (
          <PureYesOrNoQuestion
            question={question}
            name={name}
            onChange={onChange}
            value={value}
            errorMessage={errors[name]?.message as string}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default YesOrNoQuestion;
