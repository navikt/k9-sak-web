import { useForm } from 'react-hook-form';

import { Box, Button } from '@navikt/ds-react';
import { Form, TextAreaField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex.js';

enum InstitusjonFormFields {
  BEGRUNNELSE = 'begrunnelse',
  GODKJENT_INSTITUSJON = 'godkjentInstitusjon',
}
interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: string;
}

export interface InstitusjonAksjonspunktPayload {
  godkjent: boolean;
  begrunnelse: string;
  journalpostId: {
    journalpostId: string;
  };
}

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
  erRedigering: boolean;
  avbrytRedigering: () => void;
}

const InstitusjonForm = ({ vurdering, readOnly, erRedigering, avbrytRedigering }: OwnProps) => {
  const { løsAksjonspunkt9300 } = useContext(SykdomOgOpplæringContext);

  const formMethods = useForm<InstitusjonFormValues>({
    defaultValues: {
      begrunnelse: '',
      godkjentInstitusjon: '',
    },
  });

  const handleSubmit = (values: InstitusjonFormValues) => {
    løsAksjonspunkt9300({
      godkjent: values[InstitusjonFormFields.GODKJENT_INSTITUSJON] === 'ja',
      begrunnelse: values[InstitusjonFormFields.BEGRUNNELSE],
      journalpostId: vurdering.journalpostId,
    });
  };

  return (
    <Form<InstitusjonFormValues> formMethods={formMethods} onSubmit={handleSubmit}>
      <Box className="mt-8">
        <TextAreaField
          name={InstitusjonFormFields.BEGRUNNELSE}
          label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
          validate={[required, minLength(3), maxLength(10000)]}
          readOnly={readOnly}
          data-testid="begrunnelse"
        />
      </Box>

      <Box className="mt-8">
        <RadioGroupPanel
          name={InstitusjonFormFields.GODKJENT_INSTITUSJON}
          label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
          radios={[
            { label: 'Ja', value: 'ja' },
            { label: 'Nei', value: 'nei' },
          ]}
          validate={[required]}
          isReadOnly={readOnly}
          data-testid="godkjent-institusjon"
        />
      </Box>

      {!readOnly && (
        <Box className="flex mt-8">
          <Button size="small">Bekreft og fortsett</Button>

          {erRedigering && (
            <div className="ml-4">
              <Button size="small" variant="secondary" type="button" onClick={avbrytRedigering}>
                Avbryt redigering
              </Button>
            </div>
          )}
        </Box>
      )}
    </Form>
  );
};

export default InstitusjonForm;
