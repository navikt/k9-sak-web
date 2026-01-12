import type { ung_sak_kontrakt_etterlysning_Etterlysning } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { Alert, BoxNew, Button, Heading, Modal, Select, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface MenyEndreFristProps {
  etterlysninger: ung_sak_kontrakt_etterlysning_Etterlysning[];
  lukkModal: () => void;
  showSuccess?: boolean;
  endreFrister: (data: FormValues) => Promise<void>;
}

interface FormValues {
  begrunnelse: string;
  oppgave: string;
  fristDato: string;
}

export const MenyEndreFrist = ({ etterlysninger, lukkModal, showSuccess, endreFrister }: MenyEndreFristProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: '',
      oppgave: etterlysninger.length === 1 && etterlysninger[0] ? etterlysninger[0].eksternReferanse : '',
      fristDato: '',
    },
  });
  const valgtOppgave = formMethods.watch('oppgave');
  const etterlysning = etterlysninger.find(e => e.eksternReferanse === valgtOppgave);
  //   const åpneBehandlinger = behandlinger.filter(
  //     behandling => behandling.status !== ung_kodeverk_behandling_BehandlingStatus.AVSLUTTET,
  //   );

  const validateDateInRange = (value: string) => {
    if (!etterlysning?.periode?.tom || !value) {
      return undefined;
    }

    const selectedDate = dayjs(value, 'YYYY-MM-DD');
    const fromDate = dayjs(etterlysning.periode.tom);
    const toDate = fromDate.add(2, 'week');

    if (selectedDate.isBefore(fromDate, 'day')) {
      return `Dato må være etter eller lik ${fromDate.format('DD.MM.YYYY')}`;
    }

    if (selectedDate.isAfter(toDate, 'day')) {
      return `Dato kan ikke være mer enn 2 uker etter opprinnelig frist (${toDate.format('DD.MM.YYYY')})`;
    }

    return undefined;
  };

  const handleSubmit = async (formValues: FormValues) => {
    setIsSubmitting(true);
    try {
      await endreFrister(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalHeading = 'Utsett frist på oppgave til deltaker';

  if (showSuccess) {
    return (
      <Modal
        open
        onClose={lukkModal}
        aria-label={modalHeading}
        size="small"
        header={{
          heading: modalHeading,
          size: 'medium',
          closeButton: false,
        }}
      >
        <Modal.Body>
          <Alert size="small" variant="success">
            Oppgaven har fått ny frist xx.xx.xxxx. Behandlingen settes på vent.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button size="small" onClick={goToSearch}>
            Gå til forsiden
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <Modal open onClose={lukkModal} aria-label={modalHeading} size="small">
        <Modal.Header>
          <Heading size="medium">{modalHeading}</Heading>
        </Modal.Header>
        <Modal.Body>
          <VStack gap="space-24">
            <Select
              {...formMethods.register('oppgave', {
                required: true,
              })}
              label="Velg oppgave"
              readOnly={etterlysninger.length === 1}
              size="small"
            >
              {etterlysninger.map(etterlysning => (
                <option key={etterlysning.eksternReferanse} value={etterlysning.eksternReferanse}>
                  {`${etterlysning.type} (frist: ${etterlysning.periode?.tom})`}
                </option>
              ))}
            </Select>
            <RhfDatepicker
              control={formMethods.control}
              name="fristDato"
              label="Ny fristdato"
              validate={[required, hasValidDate, validateDateInRange]}
              fromDate={dayjs(etterlysning?.periode?.tom).toDate()}
              toDate={dayjs(etterlysning?.periode?.tom).add(2, 'week').toDate()}
            />
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label="Begrunnelse"
              validate={[required]}
              description="Begrunnelsen er kun synlig i historikken, og vil ikke sendes til deltaker."
            />{' '}
          </VStack>
          <BoxNew marginBlock="space-16 0">
            <Alert size="small" variant="info">
              Behandlingen blir satt på vent til ny frist utløper.
            </Alert>
          </BoxNew>
        </Modal.Body>
        <Modal.Footer>
          <Button size="small" loading={isSubmitting}>
            Utsett frist
          </Button>
          <Button size="small" variant="secondary" loading={isSubmitting}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </RhfForm>
  );
};
