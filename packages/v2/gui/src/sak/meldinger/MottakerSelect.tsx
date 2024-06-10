import { Select } from '@navikt/ds-react';
import React from 'react';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import {
  type ArbeidsgiverOpplysningerPerId,
  lagVisningsnavnForMottaker,
  type Personopplysninger,
} from '../../utils/formidling.js';

type MottakerSelectProps = {
  readonly valgtMal: Template | undefined;
  readonly valgtMottakerId: string | undefined;
  readonly personopplysninger: Personopplysninger | undefined;
  readonly arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId | undefined;
  readonly onChange?: (valgtMottakerId: string) => void;
  readonly disabled?: boolean;
};

const MottakerSelect = ({
  valgtMal,
  valgtMottakerId,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  onChange,
  disabled,
}: MottakerSelectProps) => {
  if ((valgtMal?.mottakere?.length ?? 0) > 0) {
    return (
      <Select
        label="Mottaker"
        size="small"
        placeholder="Velg mottaker"
        defaultValue={valgtMottakerId}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
      >
          {valgtMal?.mottakere.map(mottaker => (
            <option key={mottaker.id} value={mottaker.id}>
              {lagVisningsnavnForMottaker(mottaker.id, personopplysninger, arbeidsgiverOpplysningerPerId)}
            </option>
          ))}
      </Select>
    );
  }
  return null;
};

export default MottakerSelect;
