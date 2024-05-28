import { Select } from '@navikt/ds-react';
import React from 'react';
import { type Template } from '@k9-sak-web/backend/k9formidling/models/Template.ts';

interface MalSelectProps {
  readonly maler: Template[];
  readonly valgtMalkode: string | undefined;
  readonly onChange?: (valgMalkode: string | undefined) => void;
}

const MalSelect = ({ maler, valgtMalkode, onChange }: MalSelectProps) => (
  <Select label="Mal" size="small" value={valgtMalkode} onChange={e => onChange?.(e.target.value)}>
    {maler.map(mal => (
      <option key={mal.kode} value={mal.kode}>
        {mal.navn}
      </option>
    ))}
  </Select>
);

export default MalSelect;
