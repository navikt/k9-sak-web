import * as React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Checkbox } from 'nav-frontend-skjema';

interface Props {
  control: Control;
  name: string;
  label: string;
  disabled?: boolean;
}

const ControlledCheckbox = ({ control, name, label, disabled }: Props): JSX.Element => (
  <Controller
    control={control}
    defaultValue={false}
    name={name}
    render={({ field }) => (
      <Checkbox label={label} onChange={e => field.onChange(e.target.checked)} ref={field.ref} disabled={disabled} />
    )}
  />
);

export default ControlledCheckbox;
