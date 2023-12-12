import React from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';

interface YesOrNoQuestionProps {
  question: string;
  value: boolean;
  onChange: (value) => void;
  name: string;
  errorMessage?: string;
  disabled?: boolean;
}

enum YesOrNo {
  YES = 'YES',
  NO = 'NO',
}

const resolveYesOrNoLiteral = (value: boolean | undefined) => {
  if (value === true) {
    return YesOrNo.YES;
  }
  if (value === false) {
    return YesOrNo.NO;
  }
  return undefined;
};

const radios = [
  { label: 'Ja', value: YesOrNo.YES },
  { label: 'Nei', value: YesOrNo.NO },
];

const PureYesOrNoQuestion = ({ question, value, onChange, name, errorMessage, disabled }: YesOrNoQuestionProps) => (
  <RadioGroup legend={question} error={errorMessage} size="small">
    {radios.map(radio => (
      <Radio
        id={`${name}${radio.value}`}
        key={radio.value}
        name={name}
        onChange={() => {
          onChange(radio.value === YesOrNo.YES);
        }}
        checked={resolveYesOrNoLiteral(value) === radio.value}
        disabled={disabled}
        value={radio.value}
      >
        {radio.label}
      </Radio>
    ))}
  </RadioGroup>
);

export default PureYesOrNoQuestion;
