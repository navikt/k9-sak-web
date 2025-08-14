import type { ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevValgDto as InformasjonsbrevValgDto } from '@k9-sak-web/backend/ungsak/generated';
import { SelectField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';

interface MalSelectProps {
  brevmaler: InformasjonsbrevValgDto[];
}

export const MalSelect = ({ brevmaler }: MalSelectProps) => (
  <SelectField
    name="valgtMalkode"
    label="Mal"
    size="small"
    selectValues={brevmaler.map(mal => (
      <option key={mal.malType?.kode} value={mal.malType?.kode}>
        {mal.malType?.navn}
      </option>
    ))}
    validate={[required]}
  />
);
