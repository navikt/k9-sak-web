import { BodyLong, Box, Button, Heading, Radio, RadioGroup, ReadMore, Textarea, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { Controller, useForm } from 'react-hook-form';

interface TiDagerFormData {
  harUtbetaltPliktigeDager: 'ja' | 'nei';
  begrunnelse: string;
}

type Aksjonspunkt = {
  definisjon: {
    kode: string;
  };
};

interface TiDagerProsessIndexProps {
  submitCallback: (data: any) => Promise<any>;
  aksjonspunkter: Aksjonspunkt[];
}

export const TiDagerProsessIndex = ({ aksjonspunkter, submitCallback }: TiDagerProsessIndexProps) => {
  const formMethods = useForm<TiDagerFormData>();
  const { control } = formMethods;

  const onSubmit = async (data: TiDagerFormData) => {
    const payload = aksjonspunkter.map(ap => ({
      kode: ap.definisjon.kode,
      harUtbetaltPliktigeDager: data.harUtbetaltPliktigeDager === 'ja',
      begrunnelse: data.begrunnelse,
    }));
    await submitCallback(payload);
  };

  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8" width="fit-content">
      <Heading size="medium" level="2" spacing>
        Ti dager
      </Heading>
      <ReadMore header="Hvordan går jeg frem?" size="small">
        <BodyLong size="small">
          Arbeidsgiver må dekke de første 10 omsorgsdagene hvert kalenderår for ansatte som har barn under 12 år, eller
          som fyller 12 år det gjeldende året. De kan søke om refusjon fra Nav fra og med 11.dagen hvis den ansatte har
          rett på flere enn 10 omsorgsdager.
        </BodyLong>
        <BodyLong size="small">
          Fyller den ansatte vilkår for å få omsorgspenger fra første dag?Kronisk sykt barn: Ved kronisk sykt barn over
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
            <Controller
              control={control}
              name="harUtbetaltPliktigeDager"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <RadioGroup
                  legend="Fremkommer det av inntektsmelding at 10 dager er benyttet?"
                  onChange={field.onChange}
                  value={field.value ?? ''}
                  error={fieldState.error ? 'Feltet er påkrevd' : undefined}
                  size="small"
                >
                  <Radio value="ja">Ja</Radio>
                  <Radio value="nei">Nei</Radio>
                </RadioGroup>
              )}
            />

            <Controller
              control={control}
              name="begrunnelse"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label="Begrunnelse"
                  size="small"
                  error={fieldState.error ? 'Feltet er påkrevd' : undefined}
                />
              )}
            />
          </VStack>
          <Box marginBlock="space-16 space-0">
            <Button size="small" type="submit">
              Bekreft
            </Button>
          </Box>
        </RhfForm>
      </Box>
    </Box>
  );
};
