import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'nav-frontend-skjema';

interface OwnProps {
  label?: string;
  name: `${string}`;
  valideringsFunksjoner?: any;
  isMini: boolean;
  arialabel?: string;
  placeholder?: string;
  feil?: string;
}

const InputField: React.FunctionComponent<OwnProps> = ({
  label,
  name,
  valideringsFunksjoner,
  isMini,
  arialabel,
  placeholder,
  feil,
}) => {
  const { register } = useFormContext();
  const valideringsValg = valideringsFunksjoner !== undefined ? { validate: valideringsFunksjoner } : {};
  const input = register(name, valideringsValg);

  if (isMini) {
    return (
      <Input
        mini
        name={input.name}
        label={label}
        onChange={input.onChange}
        onBlur={input.onBlur}
        inputRef={input.ref}
        bredde="S"
        placeholder={placeholder}
        aria-label={arialabel}
        feil={typeof feil !== 'undefined' ? feil : ''}
      />
    );
  }
  return (
    <Input
      name={input.name}
      label={label}
      onChange={input.onChange}
      onBlur={input.onBlur}
      inputRef={input.ref}
      bredde="XS"
      placeholder={placeholder}
      aria-label={arialabel}
      feil={typeof feil !== 'undefined' ? feil : ''}
    />
  );
};
export default InputField;
