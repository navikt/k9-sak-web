import { Textarea } from 'nav-frontend-skjema';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface OwnProps {
  label: string;
  name: `${string}`;
}

const TextArea: React.FunctionComponent<OwnProps> = ({ label, name }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: { value: true, message: 'Vurdering må oppgis.' },
        pattern: {
          value:
            /^[0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'\-‐–‑/§!?@_()#+:;,="&\s~*]*$/,
          message: 'Feltet inneholder ugyldige tegn.',
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Textarea
          label={label}
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={0}
          feil={error && error.message}
        />
      )}
    />
  );
};

export default TextArea;
