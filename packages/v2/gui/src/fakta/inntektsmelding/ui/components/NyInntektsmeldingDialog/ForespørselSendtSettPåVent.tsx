import { Alert, BodyShort, Button, Dialog, HStack, VStack } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { dateAfterOrEqualToToday, hasValidDate, required } from '@navikt/ft-form-validators';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import Datovelger from '../../../../../shared/datovelger/Datovelger';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { useSettPåVent } from '../../../api/inntektsmeldingQueries';
import { Venteårsak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/Venteårsak.js';
import { goToLos } from '@k9-sak-web/lib/paths/paths.js';

interface FormData {
  frist: string;
}

export const ForespørselSendtSettPåVent = () => {
  const { behandling } = useInntektsmeldingContext();
  const iDag = dayjs().startOf('day').toDate();
  const settPåVentMutation = useSettPåVent();
  const formMethods = useForm<FormData>({
    defaultValues: {
      frist: '',
    },
    mode: 'onChange',
  });

  const handleSettPåVent = (data: FormData) => {
    if (!behandling.id || !behandling.versjon) {
      throw new Error('Behandling ID og versjon are required');
    }
    settPåVentMutation.mutate(
      {
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
        frist: data.frist,
        ventearsak: Venteårsak.INNTEKTSMELDING,
      },
      {
        onSuccess: () => {
          goToLos();
        },
      },
    );
  };

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
          <Button variant="primary" size="small" loading={settPåVentMutation.isPending} type="submit">
            Sett på vent
          </Button>
        </HStack>
      </Dialog.Footer>
    </RhfForm>
  );
};
