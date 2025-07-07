import { BodyShort, Button, ErrorMessage, Label, Link, Select, Skeleton, Tag } from '@navikt/ds-react';
import { useAlleInstitusjoner, useHentOrganisasjonsnummer } from '../../SykdomOgOpplæringQueries';
import { Controller, useFormContext } from 'react-hook-form';
import { CheckboxField, InputField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { useEffect, useState } from 'react';
import { ExternalLinkIcon, PencilIcon } from '@navikt/aksel-icons';
import { InstitusjonFormFields } from '../types/InstitusjonFormFields.js';
import type { HentAlleV2Response } from '@k9-sak-web/backend/k9sak/generated';
import { hasValidOrgNumber, required } from '@navikt/ft-form-validators';

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
  const [endreInstitusjon, setEndreInstitusjon] = useState(false);
  const { watch } = useFormContext();
  const annenInstitusjon = watch(InstitusjonFormFields.ANNEN_INSTITUSJON);

  if (isLoadingInstitusjoner) {
    return <Skeleton variant="text" width="100%" height="100px" />;
  }

  if (!institusjoner) {
    return null;
  }

  const gjeldendeInstitusjon = redigertInstitusjonNavn || institusjonFraSøknad;
  const gjeldendeInstitusjonFinnesIListen = !!institusjoner.find(
    institusjon => institusjon.navn?.toLowerCase() === gjeldendeInstitusjon.toLowerCase(),
  )?.navn;

  if (gjeldendeInstitusjonFinnesIListen) {
    return (
      <div className="flex flex-col gap-4">
        <InstitusjonSelect institusjoner={institusjoner} />
        <AnnenInstitusjonCheckbox />
        {annenInstitusjon && <OrganisasjonsnummerSøk />}
      </div>
    );
  }

  return (
    <InstitusjonFraSøknadForm
      institusjonFraSøknad={institusjonFraSøknad}
      institusjoner={institusjoner}
      endreInstitusjon={endreInstitusjon}
      setEndreInstitusjon={setEndreInstitusjon}
    />
  );
};

const validateOrganisasjonResponse = (navn: string, organisasjonsnummer: string) => {
  if (!navn) {
    return `Fant ingen organisasjon med organisasjonsnummer ${organisasjonsnummer}`;
  }

  return true;
};

const InstitusjonFraSøknadForm = ({
  institusjonFraSøknad,
  institusjoner,
  endreInstitusjon,
  setEndreInstitusjon,
}: {
  institusjonFraSøknad: string;
  institusjoner: HentAlleV2Response;
  endreInstitusjon: boolean;
  setEndreInstitusjon: (endreInstitusjon: boolean) => void;
}) => {
  const { watch } = useFormContext();
  const annenInstitusjon = watch(InstitusjonFormFields.ANNEN_INSTITUSJON);

  if (endreInstitusjon) {
    return (
      <div className="flex flex-col gap-4">
        <InstitusjonSelect institusjoner={institusjoner} />
        <AnnenInstitusjonCheckbox />
        {annenInstitusjon && <OrganisasjonsnummerSøk />}
        <EndreInstitusjonButton setEndreInstitusjon={setEndreInstitusjon} endreInstitusjon={endreInstitusjon} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <BodyShort size="small">Annen: {institusjonFraSøknad}</BodyShort>
        <Tag size="small" variant="info">
          Fra søknad
        </Tag>
      </div>
      <div>
        <EndreInstitusjonButton setEndreInstitusjon={setEndreInstitusjon} endreInstitusjon={endreInstitusjon} />
      </div>
      <div className="mt-4">
        <OrganisasjonsnummerSøk medFritekst={false} />
      </div>
    </div>
  );
};

const OrganisasjonsnummerSøk = ({ medFritekst = true }: { medFritekst?: boolean }) => {
  const { resetField } = useFormContext();

  // cleanup on unmount

  const { watch } = useFormContext();
  const organisasjonsnummer = watch(InstitusjonFormFields.ORGANISASJONSNUMMER);
  const harOrganisasjonsnummer = watch(InstitusjonFormFields.HAR_ORGANISASJONSNUMMER);
  const {
    mutate: hentOrganisasjonInfo,
    isPending,
    data: organisasjonsInfo,
    reset,
    isSuccess,
    isError,
    error,
  } = useHentOrganisasjonsnummer(organisasjonsnummer);

  console.log(error?.errorData);

  useEffect(() => {
    // hent på nytt hvis organisasjonsnummer endres
    if (organisasjonsnummer?.length === 9 && !isPending && !isSuccess && !isError) {
      hentOrganisasjonInfo(organisasjonsnummer);
    }
    // nullstill data hvis organisasjonsnummer ikke er 9 siffer
    if (organisasjonsnummer?.length !== 9) {
      reset();
    }
  }, [organisasjonsnummer, hentOrganisasjonInfo, isPending, reset, organisasjonsInfo, isSuccess, isError]);

  const visOrganisasjonsnummer = harOrganisasjonsnummer === 'ja';
  const visFritekst = harOrganisasjonsnummer === 'nei' && medFritekst;
  useEffect(() => {
    resetField(InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST);
    resetField(InstitusjonFormFields.ORGANISASJONSNUMMER);
  }, [harOrganisasjonsnummer, resetField]);

  useEffect(() => {
    return () => {
      resetField(InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST);
      resetField(InstitusjonFormFields.ORGANISASJONSNUMMER);
      resetField(InstitusjonFormFields.HAR_ORGANISASJONSNUMMER);
      reset();
    };
  }, [resetField, reset]);

  return (
    <div className="flex flex-col gap-4">
      <RadioGroupPanel
        name={InstitusjonFormFields.HAR_ORGANISASJONSNUMMER}
        label="Har institusjonen/kompetansesenteret et organisasjonsnummer?"
        radios={[
          { value: 'ja', label: 'Ja' },
          { value: 'nei', label: 'Nei' },
        ]}
        validate={[required]}
      />
      {visOrganisasjonsnummer && (
        <>
          <div className="flex flex-row gap-5">
            <InputField
              label="Organisasjonsnummer (9 siffer)"
              size="small"
              name={InstitusjonFormFields.ORGANISASJONSNUMMER}
              className="w-[275px]"
              validate={[
                required,
                hasValidOrgNumber,
                () => validateOrganisasjonResponse(organisasjonsInfo?.navn || '', organisasjonsnummer),
              ]}
            />
            <Link href="https://www.brreg.no/enhet/sok" target="_blank" className="mt-7 no-underline">
              <Button variant="tertiary" icon={<ExternalLinkIcon />} type="button" size="small">
                Gå til Brønnøysundregistrene
              </Button>
            </Link>
          </div>
          {isPending && <Skeleton variant="text" width="100%" height="100px" />}
          {isError && <ErrorMessage size="small">{error?.errorData?.feltFeil?.[0]?.melding}</ErrorMessage>}
          {organisasjonsInfo && <BodyShort size="small">{organisasjonsInfo?.navn}</BodyShort>}
          {!organisasjonsInfo && isSuccess && (
            <Label size="small" variant="error">
              Fant ingen institusjon med organisasjonsnummer {organisasjonsnummer}
            </Label>
          )}
        </>
      )}
      {visFritekst && (
        <InputField
          label="Navn på institusjonen/kompetansesenteret"
          size="small"
          name={InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST}
        />
      )}
    </div>
  );
};

const InstitusjonSelect = ({ institusjoner }: { institusjoner: HentAlleV2Response }) => {
  const { control, resetField, watch } = useFormContext();

  const annenInstitusjon = watch(InstitusjonFormFields.ANNEN_INSTITUSJON);

  useEffect(() => {
    return () => {
      resetField(InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN);
    };
  }, [resetField]);

  return (
    <Controller
      control={control}
      name={InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN}
      render={({ field }) => (
        <Select
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          size="small"
          {...field}
          hideLabel
          disabled={annenInstitusjon}
        >
          {institusjoner.map(institusjon => (
            <option key={institusjon.uuid} value={institusjon.navn}>
              {institusjon.navn}
            </option>
          ))}
        </Select>
      )}
    />
  );
};

const EndreInstitusjonButton = ({
  setEndreInstitusjon,
  endreInstitusjon,
}: {
  setEndreInstitusjon: (endreInstitusjon: boolean) => void;
  endreInstitusjon: boolean;
}) => {
  return (
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
  );
};

const AnnenInstitusjonCheckbox = () => {
  const { resetField } = useFormContext();

  // cleanup on unmount
  useEffect(() => {
    return () => {
      resetField(InstitusjonFormFields.ANNEN_INSTITUSJON);
    };
  }, [resetField]);

  return (
    <CheckboxField label="Annen institusjon eller kompetansesenter" name={InstitusjonFormFields.ANNEN_INSTITUSJON} />
  );
};

export default InstitusjonVelger;
