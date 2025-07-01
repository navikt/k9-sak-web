import { BodyShort, Button, Checkbox, Label, Select, Tag } from '@navikt/ds-react';
import { useAlleInstitusjoner } from '../../SykdomOgOpplæringQueries';
import { Controller, useFormContext } from 'react-hook-form';
import { CheckboxField } from '@navikt/ft-form-hooks';
import { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';

const InstitusjonVelger = ({ name, institusjonFraSøknad }: { name: string; institusjonFraSøknad: string }) => {
  const { data: institusjoner } = useAlleInstitusjoner();
  const { control } = useFormContext();

  const [endreInstitusjon, setEndreInstitusjon] = useState(false);

  if (!institusjoner) {
    return null;
  }

  const institusjonFraSøknadFinnesIListen = !!institusjoner.find(
    institusjon => institusjon.navn?.toLowerCase() === institusjonFraSøknad.toLowerCase(),
  )?.navn;

  return (
    <div className="flex flex-col gap-4">
      <Label size="small">På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?</Label>
      {!institusjonFraSøknadFinnesIListen && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <BodyShort size="small" className="whitespace-pre-wrap line-through">
              Annen: {institusjonFraSøknad}
            </BodyShort>
            <Tag size="small" variant="info">
              Fra søknad
            </Tag>
          </div>
        </div>
      )}
      <CheckboxField label="Annen institusjon eller kompetansesenter" name={'test'} />
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
            size="small"
            {...field}
            hideLabel
          >
            {institusjoner.map(institusjon => (
              <option key={institusjon.uuid} value={institusjon.navn}>
                {institusjon.navn}
              </option>
            ))}
          </Select>
        )}
      />
      {<div>
        <Button
          variant="tertiary"
          size="small"
          icon={<PencilIcon />}
          type="button"
          onClick={() => setEndreInstitusjon(!endreInstitusjon)}
        >
          {endreInstitusjon ? 'Avbryt' : 'Endre'}
        </Button>
      </div>}
    </div>
  );
};

export default InstitusjonVelger;
