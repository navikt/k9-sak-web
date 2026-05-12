import type {
  k9_sak_kontrakt_inngangsvilkår_AvklarRettFraDagEnDto_JournalpostVurderingDto as JournalpostVurderingDto,
  k9_sak_kontrakt_inngangsvilkår_RettFraDagEnVisningDto_JournalpostVisningDto as JournalpostVisningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ArbeidsgiverOpplysningerPerId } from '../tilkjent-ytelse/types/arbeidsgiverOpplysningerType.js';
import { BodyLong, BodyShort, Box, Button, Heading, Label, Loader, Radio, RadioGroup, ReadMore, Textarea, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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

export const TiDagerProsessIndex = ({ aksjonspunkter, submitCallback, isReadOnly, behandlingUUID, arbeidsgiverOpplysningerPerId }: TiDagerProsessIndexProps) => {
  const api = useTiDagerBackendClient();

  const {
    data: opplysninger,
    isFetching,
    isError,
  } = useQuery(
    queryOptions({
      queryKey: ['rettFraDagEn', behandlingUUID],
      queryFn: () => api.hentRettFraDagEnOpplysninger(behandlingUUID),
    }),
  );

  const defaultVurderinger = (opplysninger?.journalposter ?? []).map(jp => ({
    journalpostId: jp.journalpostId,
    harUtbetaltPliktigeDager: booleanTilJaNei(jp.harUtbetaltPliktigeDager),
  }));

  const formMethods = useForm<TiDagerFormData>({
    defaultValues: { vurderinger: defaultVurderinger, begrunnelse: '' },
  });

  const { fields } = useFieldArray({ control: formMethods.control, name: 'vurderinger' });

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

  if (isFetching) {
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
      <Box marginBlock="space-8">
        <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
          <VStack gap="space-16">
            {fields.map((field, index) => {
              const journalpost = opplysninger?.journalposter.find(jp => jp.journalpostId === field.journalpostId);
              return (
                <Box key={field.id} borderWidth="1" borderRadius="8" padding="space-12">
                  <VStack gap="space-8">
                    <VStack gap="space-4">
                      <Label size="small">Arbeidsgiver</Label>
                      <BodyShort size="small">{journalpost ? formatArbeidsgiverNavn(journalpost, arbeidsgiverOpplysningerPerId) : field.journalpostId}</BodyShort>
                    </VStack>
                    <VStack gap="space-4">
                      <Label size="small">Første fraværsdag</Label>
                      <BodyShort size="small">{journalpost?.foersteOppgitteFravaersdag ?? '–'}</BodyShort>
                    </VStack>
                    <Controller
                      control={formMethods.control}
                      name={`vurderinger.${index}.harUtbetaltPliktigeDager`}
                      rules={{ required: true }}
                      render={({ field: radioField, fieldState }) => (
                        <RadioGroup
                          legend="Har arbeidsgiveren rett fra første dag selv om pliktige dager ikke er dekket?"
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

            <Controller
              control={formMethods.control}
              name="begrunnelse"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label="Begrunnelse"
                  size="small"
                  error={fieldState.error ? 'Feltet er påkrevd' : undefined}
                  readOnly={isReadOnly}
                />
              )}
            />
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
