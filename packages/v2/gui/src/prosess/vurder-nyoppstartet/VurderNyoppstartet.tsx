import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Alert, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { Datepicker, Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidDate, minLength, required } from '@navikt/ft-form-validators';
import { useForm, useWatch } from 'react-hook-form';

interface FormValues {
  begrunnelse: string;
  erNyoppstartet: boolean;
  fom: string;
}

interface SubmitValues extends FormValues {
  kode: string;
  fortsettBehandling: boolean;
}

interface VurderNyoppstartetProps {
  submitCallback: (data: SubmitValues[]) => void;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  aksjonspunkter: AksjonspunktDto[];
}

export const VurderNyoppstartet = ({
  submitCallback,
  harApneAksjonspunkter,
  readOnly,
  aksjonspunkter,
}: VurderNyoppstartetProps) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktCodes.VURDER_NYOPPSTARTET);
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: aksjonspunkt?.begrunnelse || '',
      erNyoppstartet: undefined,
      fom: '',
    },
  });

  const erNyoppstartet = useWatch({ control: formMethods.control, name: 'erNyoppstartet' });

  const onSubmit = (values: FormValues) => {
    submitCallback([
      {
        ...values,
        fom: values.erNyoppstartet ? values.fom : '',
        kode: AksjonspunktCodes.VURDER_NYOPPSTARTET,
        fortsettBehandling: true, // skal mest sannsynlig bort
      },
    ]);
  };

  return (
    <VStack gap="4">
      <Heading level="1" size="medium">
        Nyoppstartet
      </Heading>
      {harApneAksjonspunkter && (
        <Alert size="small" variant="warning">
          Vurder om søker er nyoppstartet
        </Alert>
      )}
      <Form<FormValues> formMethods={formMethods} onSubmit={onSubmit}>
        <VStack gap="4">
          <RadioGroupPanel
            name="erNyoppstartet"
            label="Er søker nyoppstartet?"
            isTrueOrFalseSelection
            radios={[
              {
                label: 'Ja',
                value: 'true',
              },
              {
                label: 'Nei',
                value: 'false',
              },
            ]}
            validate={[required]}
            isReadOnly={readOnly}
          />
          {erNyoppstartet && (
            <Datepicker
              name="fom"
              label="Dato for nyoppstartet"
              validate={[required, hasValidDate]}
              isReadOnly={readOnly}
            />
          )}
          <Box maxWidth="70ch">
            <TextAreaField
              name="begrunnelse"
              label="Begrunnelse"
              validate={[required, minLength(3)]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </Box>
          {!readOnly && (
            <HStack>
              <Button type="submit" size="small">
                Bekreft
              </Button>
            </HStack>
          )}
        </VStack>
      </Form>
    </VStack>
  );
};
