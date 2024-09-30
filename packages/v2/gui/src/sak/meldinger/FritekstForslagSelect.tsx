import { Select } from '@navikt/ds-react';
import { type FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';

type FritekstForslagSelectProps = {
  readonly fritekstForslag: FritekstbrevDokumentdata[];
  readonly value?: FritekstbrevDokumentdata;
  readonly onChange: (v: FritekstbrevDokumentdata) => void;
};

const FritekstForslagSelect = ({ fritekstForslag, value, onChange }: FritekstForslagSelectProps) => {
  if (fritekstForslag.length > 0) {
    const handleChange = (tittel: string) => {
      for (const v of fritekstForslag) {
        if (v.tittel === tittel) {
          onChange(v);
          return;
        }
      }
    };
    return (
      <Select
        size="small"
        label="Type dokumentasjon du vil etterspørre"
        placeholder="Velg type"
        value={value?.tittel}
        onChange={ev => handleChange(ev.target.value)}
      >
        {fritekstForslag.map(forslag => (
          <option key={forslag.tittel} value={forslag.tittel}>
            {forslag.tittel}
          </option>
        ))}
      </Select>
    );
  }
  return null;
};

export default FritekstForslagSelect;
