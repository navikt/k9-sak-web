import type { AvklarRettFraDagEnDto_JournalpostVurderingDto as JournalpostVurderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/AvklarRettFraDagEnDto.js';
import type { RettFraDagEnVisningDto_JournalpostVisningDto as JournalpostVisningDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/RettFraDagEnVisningDto.js';
import { FileIcon } from '@navikt/aksel-icons';
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Label,
  Link,
  Loader,
  Radio,
  RadioGroup,
  ReadMore,
  Textarea,
  VStack,
} from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import type { ArbeidsgiverOpplysningerPerId } from '../tilkjent-ytelse/types/arbeidsgiverOpplysningerType.js';
import { useTiDagerBackendClient } from './TiDagerBackendClientContext.js';

interface TiDagerVurderingFormData {
  journalpostId: string;
  harUtbetaltPliktigeDager?: 'ja' | 'nei';
}

interface TiDagerFormData {
  vurderinger: TiDagerVurderingFormData[];
  begrunnelse: string;
}

interface TiDagerSubmitModel {
  kode: string;
  begrunnelse: string;
  avklarRettFraDagEn: {
    vurderinger: JournalpostVurderingDto[];
  };
}

interface TiDagerProsessIndexProps {
  submitCallback: (data: TiDagerSubmitModel[]) => Promise<void>;
  aksjonspunkter: { definisjon: { kode: string } }[];
  isReadOnly: boolean;
  behandlingUUID: string;
  saksnummer: string;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

function formatArbeidsgiverNavn(
  journalpost: JournalpostVisningDto,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string {
  const identifikator = journalpost.arbeidsgiver?.arbeidsgiverOrgnr ?? journalpost.arbeidsgiver?.arbeidsgiverAktørId;
  if (identifikator) {
    const navn = arbeidsgiverOpplysningerPerId?.[identifikator]?.navn;
    if (navn) return navn;
  }
  return identifikator ?? journalpost.journalpostId;
}

function booleanTilJaNei(value: boolean | null | undefined): 'ja' | 'nei' | undefined {
  if (value == null) return undefined;
  return value ? 'ja' : 'nei';
}

export const TiDagerProsessIndex = ({
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  behandlingUUID,
  saksnummer,
  arbeidsgiverOpplysningerPerId,
}: TiDagerProsessIndexProps) => {
  const api = useTiDagerBackendClient();

  const {
    data: opplysninger,
    isPending,
    isError,
  } = useQuery(
    queryOptions({
      queryKey: ['rettFraDagEn', behandlingUUID],
      queryFn: () => api.hentRettFraDagEnOpplysninger(behandlingUUID),
    }),
  );

  const formMethods = useForm<TiDagerFormData>({
    defaultValues: { vurderinger: [], begrunnelse: '' },
  });

  const { fields } = useFieldArray({ control: formMethods.control, name: 'vurderinger' });

  useEffect(() => {
    if (opplysninger) {
      const vurderinger = opplysninger.journalposter.map(jp => ({
        journalpostId: jp.journalpostId,
        harUtbetaltPliktigeDager: booleanTilJaNei(jp.harUtbetaltPliktigeDager),
      }));
      formMethods.reset({ vurderinger, begrunnelse: '' });
    }
  }, [opplysninger, formMethods]);

  const onSubmit = async (data: TiDagerFormData) => {
    const payload = aksjonspunkter.map(ap => ({
      kode: ap.definisjon.kode,
      begrunnelse: data.begrunnelse,
      avklarRettFraDagEn: {
        vurderinger: data.vurderinger.map(v => {
          const journalpost = opplysninger?.journalposter.find(jp => jp.journalpostId === v.journalpostId);
          return {
            journalpostId: v.journalpostId,
            harUtbetaltPliktigeDager: v.harUtbetaltPliktigeDager === 'ja',
            arbeidsgiver: journalpost?.arbeidsgiver,
          };
        }),
      },
    }));
    await submitCallback(payload);
  };

  if (isPending) {
    return <Loader title="Laster opplysninger om rett fra dag én" />;
  }

  if (isError) {
    return (
      <Box paddingInline="space-16 space-32" paddingBlock="space-8">
        <BodyShort>Kunne ikke hente opplysninger om rett fra dag én.</BodyShort>
      </Box>
    );
  }

  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8" width="fit-content">
      <Heading size="medium" level="2" spacing>
        Ti dager
      </Heading>
      <ReadMore header="Hvordan går jeg frem?" size="small">
        <BodyLong size="small">
          Arbeidsgiver må dekke de første 10 omsorgsdagene hvert kalenderår for ansatte som har barn under 12 år, eller
          som fyller 12 år det gjeldende året. De kan søke om refusjon fra Nav fra og med 11. dagen hvis den ansatte har
          rett på flere enn 10 omsorgsdager.
        </BodyLong>
        <BodyLong size="small">
          Fyller den ansatte vilkår for å få omsorgspenger fra første dag? Kronisk sykt barn: Ved kronisk sykt barn over
          12, og ingen andre barn under 13 år, kan arbeidsgiver søke om refusjon fra første fraværsdag.
        </BodyLong>
        <BodyLong size="small">
          Avbrudd i arbeidsforholdet: Dette kan være når arbeidstaker har vært i arbeid eller likestilte situasjoner i
          fire uker, men hele perioden er ikke opptjent hos nåværende arbeidsgiver. For eksempel kan det være ved bytte
          av arbeidsforhold, eller når en har mottatt ytelser til livsopphold etter kapittel 4, 8, 9 eller 14 i mer enn
          14 dager, og er tilbake i arbeid.
        </BodyLong>
      </ReadMore>
      <Box marginBlock="space-16 space-8">
        <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
          <VStack gap="space-16">
            <Controller
              control={formMethods.control}
              name="begrunnelse"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label="Fyller den ansatte vilkår for å få omsorgspenger fra første dag?"
                  size="small"
                  error={fieldState.error ? 'Feltet er påkrevd' : undefined}
                  readOnly={isReadOnly}
                />
              )}
            />
            {fields.map((field, index) => {
              const journalpost = opplysninger?.journalposter.find(jp => jp.journalpostId === field.journalpostId);
              return (
                <Box key={field.id} borderWidth="1" borderRadius="8" padding="space-12">
                  <VStack gap="space-8">
                    <VStack gap="space-4">
                      <Label size="small">Arbeidsgiver</Label>
                      <BodyShort size="small">
                        {journalpost
                          ? formatArbeidsgiverNavn(journalpost, arbeidsgiverOpplysningerPerId)
                          : field.journalpostId}
                      </BodyShort>
                    </VStack>
                    {journalpost?.dokumentId && (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/k9/sak/api/dokument/hent-dokument?saksnummer=${saksnummer}&journalpostId=${journalpost.journalpostId}&dokumentId=${journalpost.dokumentId}`}
                        data-color="accent"
                      >
                        <HStack align="center" gap="space-4">
                          <FileIcon title="Inntektsmelding" width={24} height={24} />
                          {`Inntektsmelding (${journalpost.journalpostId})`}
                        </HStack>
                      </Link>
                    )}
                    <Controller
                      control={formMethods.control}
                      name={`vurderinger.${index}.harUtbetaltPliktigeDager`}
                      rules={{ required: true }}
                      render={({ field: radioField, fieldState }) => (
                        <RadioGroup
                          legend={`Har arbeidsgiveren rett fra første dag selv om pliktige dager ikke er dekket? (${journalpost ? formatArbeidsgiverNavn(journalpost, arbeidsgiverOpplysningerPerId) : 'Ukjent arbeidsgiver'})`}
                          onChange={radioField.onChange}
                          value={radioField.value ?? ''}
                          error={fieldState.error ? 'Feltet er påkrevd' : undefined}
                          size="small"
                          readOnly={isReadOnly}
                        >
                          <Radio value="ja">Ja</Radio>
                          <Radio value="nei">Nei</Radio>
                        </RadioGroup>
                      )}
                    />
                  </VStack>
                </Box>
              );
            })}
          </VStack>
          {!isReadOnly && (
            <Box marginBlock="space-16 space-0">
              <Button size="small" type="submit" loading={formMethods.formState.isSubmitting}>
                Bekreft
              </Button>
            </Box>
          )}
        </RhfForm>
      </Box>
    </Box>
  );
};
