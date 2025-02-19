import { useForm } from 'react-hook-form';
import { Form, TextAreaField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { Box, Button } from '@navikt/ds-react';
import type { InstitusjonVurderingMedPerioder } from '@k9-sak-web/types';

enum InstitusjonFormFields {
  BEGRUNNELSE = 'begrunnelse',
  GODKJENT_INSTITUSJON = 'godkjentInstitusjon',
}
interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: boolean;
}

interface InstitusjonFormProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  erRedigering: boolean;
  løsAksjonspunkt: (payload: any) => void;
  avbrytRedigering: () => void;
}

const InstitusjonForm = ({ readOnly, erRedigering, avbrytRedigering }: InstitusjonFormProps) => {
  const formMethods = useForm<InstitusjonFormValues>({
    defaultValues: {
      begrunnelse: '',
      godkjentInstitusjon: false,
    },
  });

  const handleSubmit = (values: InstitusjonFormValues) => {
    console.log(values);
  };

  return (
    <Form<InstitusjonFormValues> formMethods={formMethods} onSubmit={handleSubmit}>
      <Box className="mt-8">
        <TextAreaField
          name={InstitusjonFormFields.BEGRUNNELSE}
          label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
          validate={[required, minLength(3), maxLength(10000)]}
          readOnly={readOnly}
        />
      </Box>

      <Box className="mt-8">
        <RadioGroupPanel
          name={InstitusjonFormFields.GODKJENT_INSTITUSJON}
          label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
          isTrueOrFalseSelection
          radios={[
            { label: 'Ja', value: 'true' },
            { label: 'Nei', value: 'false' },
          ]}
          validate={[required]}
          isReadOnly={readOnly}
        />
      </Box>

      <Box className="mt-8">
        <Button size="small">Bekreft og fortsett</Button>

        {erRedigering && (
          <Button size="small" variant="secondary" type="button" className="ml-4" onClick={avbrytRedigering}>
            Avbryt redigering
          </Button>
        )}
      </Box>
    </Form>
  );
};

export default InstitusjonForm;
