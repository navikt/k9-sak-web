import { BodyShort, Button, Label, Select, Skeleton, Tag } from '@navikt/ds-react';
import { useAlleInstitusjoner } from '../../SykdomOgOpplæringQueries';
import { Controller, useFormContext } from 'react-hook-form';
import { CheckboxField } from '@navikt/ft-form-hooks';
import { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';
import { InstitusjonFormFields } from '../types/InstitusjonFormFields.js';

const InstitusjonVelger = ({
  institusjonFraSøknad,
  redigertInstitusjonNavn,
}: {
  // Dette er navnet på institusjon som søker har oppgitt i søknaden.
  institusjonFraSøknad: string;
  // Dette er navnet som saksbehandler har overstyrt til. Dette er ikke satt hvis saksbehandler ikke har endret navnet fra søknaden.
  // Det er verdien fra backend, og ikke samme verdi som ligger i form state.
  redigertInstitusjonNavn?: string;
}) => {
  const { data: institusjoner, isLoading: isLoadingInstitusjoner } = useAlleInstitusjoner();
  const { control } = useFormContext();

  const [endreInstitusjon, setEndreInstitusjon] = useState(false);

  if (isLoadingInstitusjoner) {
    return <Skeleton variant="text" width="100%" height="100px" />;
  }

  if (!institusjoner) {
    return null;
  }

  const gjeldendeInstitusjon = redigertInstitusjonNavn || institusjonFraSøknad;
  const institusjonFraSøknadFinnesIListen = !!institusjoner.find(
    institusjon => institusjon.navn?.toLowerCase() === institusjonFraSøknad.toLowerCase(),
  )?.navn;

  const gjeldendeInstitusjonFinnesIListen = !!institusjoner.find(
    institusjon => institusjon.navn?.toLowerCase() === gjeldendeInstitusjon.toLowerCase(),
  )?.navn;

  // Vil vise label med institusjon fra søknad hvis
  // 1. Det er det gjeldende navnet som aksjonspunktet vil løses med
  // 2. Man er på vei til å endre navnet og den ikke finnes i Select-listen. Men da med strikethrough på navnet for å vise at det kommer til å bli endret.
  const visInstitusjonFraSøknad = !institusjonFraSøknadFinnesIListen && !redigertInstitusjonNavn;

  const visAnnenInstitusjonCheckbox =
    gjeldendeInstitusjonFinnesIListen || (endreInstitusjon && !gjeldendeInstitusjonFinnesIListen);
  const visSelect = gjeldendeInstitusjonFinnesIListen || (endreInstitusjon && !gjeldendeInstitusjonFinnesIListen);
  const visEndre = gjeldendeInstitusjon === institusjonFraSøknad;

  return (
    <div className="flex flex-col gap-4">
      <Label size="small">På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?</Label>
      {visInstitusjonFraSøknad && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <BodyShort size="small" className={`${endreInstitusjon ? 'line-through' : ''}`}>
              Annen: {institusjonFraSøknad}
            </BodyShort>
            <Tag size="small" variant="info">
              Fra søknad
            </Tag>
          </div>
        </div>
      )}
      {visSelect && (
        <Controller
          control={control}
          name={InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN}
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
      )}
      {visAnnenInstitusjonCheckbox && <CheckboxField label="Annen institusjon eller kompetansesenter" name={'test'} />}

      {visEndre && (
        <div>
          <Button
            variant="tertiary"
            size="small"
            icon={<PencilIcon />}
            type="button"
            onClick={() => setEndreInstitusjon(!endreInstitusjon)}
          >
            {endreInstitusjon ? 'Avbryt' : 'Endre'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstitusjonVelger;
