import { Radio } from 'nav-frontend-skjema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface OwnProps {
  label: string;
  value: string;
  name: `${string}`;
  valideringsFunksjoner?: any;
}

const RadioButtonWithBooleanValue: React.FunctionComponent<OwnProps> = ({
  label,
  value,
  name,
  valideringsFunksjoner,
}) => {
  const { register } = useFormContext();
  const valideringsValg =
    valideringsFunksjoner !== undefined ? { validate: valideringsFunksjoner } : { required: true };
  const radio = register(name, valideringsValg);

  return (
    <Radio
      label={label}
      value={value}
      name={radio.name}
      onChange={radio.onChange}
      onBlur={radio.onBlur}
      radioRef={radio.ref}
    />
  );
};

export default RadioButtonWithBooleanValue;
