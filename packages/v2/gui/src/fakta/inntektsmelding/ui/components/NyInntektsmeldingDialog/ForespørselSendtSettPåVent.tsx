import { Alert, BodyShort, Button, Dialog, HStack, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { dateAfterOrEqualToToday, hasValidDate, required } from '@navikt/ft-form-validators';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import Datovelger from '../../../../../shared/datovelger/Datovelger';

interface FormData {
  frist: string;
}

export const ForespørselSendtSettPåVent = () => {
  const iDag = dayjs().startOf('day').toDate();

  const formMethods = useForm<FormData>({
    defaultValues: {
      frist: '',
    },
    mode: 'onChange',
  });
  const { watch } = formMethods;

  const handleSettPåVent = (data: FormData) => {
    // TODO: Implementer sett på vent logikk
    console.log('Setter på vent med frist:', data.frist);
  };

  console.log(watch('frist'));
  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSettPåVent}>
      <Dialog.Body>
        <VStack gap="space-24">
          <Alert variant="success" size="small">
            Ny oppgave om inntektsmelding er sendt til arbeidsgiver.
          </Alert>

          <div>
            <HStack className="gap-8" align="start">
              <BodyShort size="small" as="div">
                Behandlingen settes på vent med frist:
              </BodyShort>
              <Datovelger
                name="frist"
                label="Frist"
                hideLabel
                size="small"
                fromDate={iDag}
                validate={[hasValidDate, required, dateAfterOrEqualToToday]}
              />
            </HStack>
          </div>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer>
        <HStack gap="space-16" justify="end">
          <Dialog.CloseTrigger>
            <Button variant="secondary" size="small">
              Gå tilbake til saken
            </Button>
          </Dialog.CloseTrigger>
          <Button variant="primary" size="small" type="submit">
            Sett på vent
          </Button>
        </HStack>
      </Dialog.Footer>
    </RhfForm>
  );
};
