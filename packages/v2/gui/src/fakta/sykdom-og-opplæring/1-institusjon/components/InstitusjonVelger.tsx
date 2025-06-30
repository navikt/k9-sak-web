import { Select } from '@navikt/ds-react';
import { useAlleInstitusjoner } from '../../SykdomOgOpplæringQueries';

const InstitusjonVelger = () => {
  const { data: institusjoner } = useAlleInstitusjoner();
  console.log(institusjoner);

  if (!institusjoner) {
    return null;
  }

  return (
    <div>
      <Select label="Velg institusjon" size="small">
        {institusjoner.map(institusjon => (
          <option key={institusjon.uuid} value={institusjon.uuid}>
            {institusjon.navn}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default InstitusjonVelger;
