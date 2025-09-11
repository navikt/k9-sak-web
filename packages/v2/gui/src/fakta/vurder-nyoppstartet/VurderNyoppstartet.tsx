import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Alert, Box, Button, Heading, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidDate, minLength, required } from '@navikt/ft-form-validators';
import { useForm, useWatch } from 'react-hook-form';

interface FormValues {
  begrunnelse: string | null;
  erNyoppstartet: boolean | null;
  fom: string | null;
}

export interface SubmitValues {
  kode: string;
  begrunnelse: string | null;
  avklarNyoppstartet: { fom: string | null; erNyoppstartet: boolean };
}

interface VurderNyoppstartetProps {
  submitCallback: (data: SubmitValues[]) => void;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  formDefaultValues: FormValues;
}

export const VurderNyoppstartet = ({
  submitCallback,
  harApneAksjonspunkter,
  readOnly,
  formDefaultValues,
}: VurderNyoppstartetProps) => {
  const formMethods = useForm<FormValues>({
    defaultValues: formDefaultValues,
  });

  const erNyoppstartet = useWatch({ control: formMethods.control, name: 'erNyoppstartet' });

  const onSubmit = (values: FormValues) => {
    submitCallback([
      {
        begrunnelse: values.begrunnelse,
        kode: AksjonspunktCodes.VURDER_NYOPPSTARTET,
        avklarNyoppstartet: {
          fom: values.erNyoppstartet ? values.fom : null,
          erNyoppstartet: !!values.erNyoppstartet,
        },
      },
    ]);
  };

  return (
    <VStack gap="space-16">
      <Heading level="1" size="medium">
        Nyoppstartet
      </Heading>
      {harApneAksjonspunkter && (
        <Alert size="small" variant="warning">
          Vurder om søker er nyoppstartet
        </Alert>
      )}
      <RhfForm<FormValues> formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="space-16">
          <RhfRadioGroup
            control={formMethods.control}
            name="erNyoppstartet"
            label="Er søker nyoppstartet?"
            validate={[required]}
            isReadOnly={readOnly}
          >
            <Radio value={true}>Ja</Radio>
            <Radio value={false}>Nei</Radio>
          </RhfRadioGroup>
          {erNyoppstartet && (
            <RhfDatepicker
              control={formMethods.control}
              name="fom"
              label="Dato for nyoppstartet"
              validate={[required, hasValidDate]}
              isReadOnly={readOnly}
            />
          )}
          <Box.New maxWidth="70ch">
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label="Begrunnelse"
              validate={[required, minLength(3)]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </Box.New>
          {!readOnly && (
            <HStack>
              <Button type="submit" size="small">
                Bekreft
              </Button>
            </HStack>
          )}
        </VStack>
      </RhfForm>
    </VStack>
  );
};
