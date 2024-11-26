import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Box, Button, HStack, VStack } from '@navikt/ds-react';
import { Datepicker, Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidDate, minLength, required } from '@navikt/ft-form-validators';
import { useForm, useWatch } from 'react-hook-form';

interface FormValues {
  begrunnelse: string;
  erNyoppstartet: boolean;
  nyoppstartetFom: string;
}

interface SubmitValues extends FormValues {
  kode: string;
}

interface VurderNyoppstartetProps {
  submitCallback: (data: SubmitValues) => void;
}

export const VurderNyoppstartet = ({ submitCallback }: VurderNyoppstartetProps) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: '',
      erNyoppstartet: undefined,
      nyoppstartetFom: '',
    },
  });

  const erNyoppstartet = useWatch({ control: formMethods.control, name: 'erNyoppstartet' });

  const onSubmit = (values: FormValues) => {
    submitCallback({
      ...values,
      nyoppstartetFom: values.erNyoppstartet ? values.nyoppstartetFom : '',
      kode: AksjonspunktCodes.VURDER_NYOPPSTARTET,
    });
  };

  return (
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
        />
        {erNyoppstartet && (
          <Datepicker name="nyoppstartetFom" label="Dato for nyoppstartet" validate={[required, hasValidDate]} />
        )}
        <Box maxWidth="70ch">
          <TextAreaField name="begrunnelse" label="Begrunnelse" validate={[required, minLength(3)]} maxLength={1500} />
        </Box>
        <HStack>
          <Button type="submit" size="small">
            Bekreft
          </Button>
        </HStack>
      </VStack>
    </Form>
  );
};
