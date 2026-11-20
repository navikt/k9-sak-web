import { VergeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/verge/VergeType.js';
import type { VergeDto } from '@k9-sak-web/backend/combined/kontrakt/verge/VergeDto.js';
import {
  $AvklarVergeDto as $K9TilbakeAvklarVergeDto,
  type AvklarVergeDto as K9TilbakeAvklarVergeDto,
} from '@k9-sak-web/backend/k9tilbake/kontrakt/aksjonspunkt/AvklarVergeDto.js';
import {
  $AvklarVergeDto as $UngTilbakeAvklarVergeDto,
  type AvklarVergeDto as UngTilbakeAvklarVergeDto,
} from '@k9-sak-web/backend/ungtilbake/kontrakt/aksjonspunkt/AvklarVergeDto.js';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { RhfForm, RhfSelect, RhfTextarea, RhfTextField } from '@navikt/ft-form-hooks';
import {
  hasValidFodselsnummer,
  hasValidName,
  hasValidOrgNumber,
  hasValidText,
  maxLength,
  required,
} from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Periodevelger from '../../shared/periodevelger/Periodevelger.js';
import { backendNavn } from '../../utils/BackendTilhørighet.js';
import {
  navnMedLatinskeBokstaverForUngTilbake,
  navnUtenTallForK9Tilbake,
  normaliserBegrunnelse,
  organisasjonsnummerMedNiSiffer,
} from './registrerVergeValidering.js';

export type VergeRegistrering = K9TilbakeAvklarVergeDto & UngTilbakeAvklarVergeDto;

export interface VergeTypeValg {
  kode: VergeType;
  navn: string;
}

interface RegistrerVergeFormValues {
  vergeType: string;
  navn: string;
  fnr: string;
  organisasjonsnummer: string;
  gyldigFom: string;
  gyldigTom: string;
  begrunnelse: string;
}

interface RegistrerVergeFormProps {
  backend: typeof backendNavn.k9tilbake | typeof backendNavn.ungtilbake;
  verge: VergeDto | null;
  vergeTyper: VergeTypeValg[];
  kanAvbryte: boolean;
  onSubmit: (registrering: VergeRegistrering) => Promise<void>;
  onAvbryt: () => void;
}

const påkrevd = (value: string) => required(value) ?? undefined;

const tilVergeType = (kode: string | undefined): VergeType | undefined =>
  Object.values(VergeType).find(vergeType => vergeType === kode && vergeType !== VergeType.UDEFINERT);

const lagDefaultValues = (verge: VergeDto | null): RegistrerVergeFormValues => ({
  vergeType: tilVergeType(verge?.vergeType) ?? '',
  navn: verge?.navn ?? '',
  fnr: verge?.fnr ?? '',
  organisasjonsnummer: verge?.organisasjonsnummer ?? '',
  gyldigFom: verge?.gyldigFom ?? '',
  gyldigTom: verge?.gyldigTom ?? '',
  begrunnelse: decodeHtmlEntity(verge?.begrunnelse) ?? '',
});

export const RegistrerVergeForm = ({
  backend,
  verge,
  vergeTyper,
  kanAvbryte,
  onSubmit,
  onAvbryt,
}: RegistrerVergeFormProps) => {
  // values: React Hook Form tilbakestiller skjemaet og Avbryt-grunnlaget bare når lagrede verdier faktisk er endret
  // (dyp sammenligning), slik at ulagrede endringer beholdes når samme data hentes på nytt.
  const lagredeVerdier = useMemo(() => lagDefaultValues(verge), [verge]);
  const formMethods = useForm<RegistrerVergeFormValues>({ defaultValues: lagredeVerdier, values: lagredeVerdier });
  const { control } = formMethods;
  const { isSubmitting, defaultValues } = formMethods.formState;
  const valgtVergeType = tilVergeType(useWatch({ control, name: 'vergeType' }));

  const skjema = backend === backendNavn.k9tilbake ? $K9TilbakeAvklarVergeDto : $UngTilbakeAvklarVergeDto;
  const navnMaksLengde = skjema.properties.navn.maxLength;
  const begrunnelseMaksLengde = skjema.properties.begrunnelse.maxLength;
  const navnTegnForBackend =
    backend === backendNavn.k9tilbake ? navnUtenTallForK9Tilbake : navnMedLatinskeBokstaverForUngTilbake;

  const avbryt = () => {
    formMethods.reset();
    onAvbryt();
  };

  const sendInn = async (values: RegistrerVergeFormValues) => {
    const vergeType = tilVergeType(values.vergeType);
    if (vergeType === undefined) {
      return;
    }
    const begrunnelse = normaliserBegrunnelse(values.begrunnelse);
    await onSubmit({
      vergeType,
      navn: values.navn.trim(),
      gyldigFom: values.gyldigFom,
      gyldigTom: values.gyldigTom,
      ...(vergeType === VergeType.ADVOKAT ? { organisasjonsnummer: values.organisasjonsnummer } : { fnr: values.fnr }),
      ...(begrunnelse !== '' ? { begrunnelse } : {}),
    });
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={sendInn}>
      <VStack gap="space-16" className="max-w-xl">
        <RhfSelect
          control={control}
          name="vergeType"
          label="Type verge"
          size="small"
          validate={[påkrevd]}
          selectValues={vergeTyper.map(({ kode, navn }) => (
            <option key={kode} value={kode}>
              {navn}
            </option>
          ))}
        />
        <RhfTextField
          control={control}
          name="navn"
          label="Navn"
          size="small"
          validate={[
            påkrevd,
            (value: string) => maxLength(navnMaksLengde)(value),
            (value: string) => hasValidName(value),
            navnTegnForBackend,
          ]}
        />
        {valgtVergeType === VergeType.ADVOKAT && (
          <RhfTextField
            control={control}
            name="organisasjonsnummer"
            label="Organisasjonsnummer"
            size="small"
            htmlSize={14}
            validate={[påkrevd, (value: string) => hasValidOrgNumber(value), organisasjonsnummerMedNiSiffer]}
          />
        )}
        {valgtVergeType !== undefined && valgtVergeType !== VergeType.ADVOKAT && (
          <RhfTextField
            control={control}
            name="fnr"
            label="Fødselsnummer"
            size="small"
            htmlSize={14}
            validate={[påkrevd, (value: string) => hasValidFodselsnummer(value)]}
          />
        )}
        {/* Datovelger leser bare startverdien. Også en navneendring kan tilbakestille datoene i skjemaet. */}
        <Periodevelger
          key={JSON.stringify(defaultValues)}
          fromField={{ name: 'gyldigFom', validate: [påkrevd] }}
          toField={{ name: 'gyldigTom', validate: [påkrevd] }}
          fromLabel="Gyldig fra"
          toLabel="Gyldig til"
        />
        <RhfTextarea
          control={control}
          name="begrunnelse"
          label="Begrunnelse (valgfritt)"
          size="small"
          maxLength={begrunnelseMaksLengde}
          validate={[
            (value: string) => maxLength(begrunnelseMaksLengde)(normaliserBegrunnelse(value)),
            (value: string) => hasValidText(normaliserBegrunnelse(value)),
          ]}
        />
        <HStack gap="space-16">
          <Button size="small" loading={isSubmitting}>
            Bekreft og fortsett
          </Button>
          {kanAvbryte && (
            <Button size="small" variant="secondary" type="button" disabled={isSubmitting} onClick={avbryt}>
              Avbryt
            </Button>
          )}
        </HStack>
      </VStack>
    </RhfForm>
  );
};
