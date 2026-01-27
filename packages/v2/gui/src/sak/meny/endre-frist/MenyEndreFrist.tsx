import type { ung_sak_kontrakt_etterlysning_Etterlysning } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { Alert, BoxNew, Button, Heading, Modal, Select, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

interface MenyEndreFristProps {
  etterlysninger: ung_sak_kontrakt_etterlysning_Etterlysning[];
  lukkModal: () => void;
  showSuccess?: boolean;
  endreFrister: (data: FormValues) => Promise<void>;
  isLoading: boolean;
  submitError?: string;
  nyFrist?: string;
}

interface FormValues {
  begrunnelse: string;
  oppgave: string;
  fristDato: string;
}

export const MenyEndreFrist = ({
  etterlysninger,
  lukkModal,
  showSuccess,
  endreFrister,
  isLoading,
  submitError,
  nyFrist,
}: MenyEndreFristProps) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      begrunnelse: '',
      oppgave: etterlysninger.length === 1 && etterlysninger[0] ? etterlysninger[0].eksternReferanse : '',
      fristDato: '',
    },
  });

  const validateDateInRange = (value: string) => {
    if (!value) {
      return undefined;
    }

    const selectedDate = dayjs(value, 'YYYY-MM-DD');
    const fromDate = dayjs();
    const toDate = fromDate.add(2, 'week');

    if (selectedDate.isBefore(fromDate, 'day')) {
      return `Dato må være etter eller lik ${fromDate.format('DD.MM.YYYY')}`;
    }

    if (selectedDate.isAfter(toDate, 'day')) {
      return `Dato kan ikke være mer enn 2 uker etter dagens dato. Maks dato er ${toDate.format('DD.MM.YYYY')}`;
    }

    return undefined;
  };

  const handleSubmit = async (formValues: FormValues) => {
    return endreFrister(formValues);
  };

  const modalHeading = 'Utsett frist på oppgave til deltaker';

  if (showSuccess || isLoading) {
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
        {showSuccess && (
          <>
            <Modal.Body>
              <Alert size="small" variant="success">
                Oppgaven har fått ny frist {dayjs(nyFrist).format('DD.MM.YYYY')}.
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="small"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Lukk
              </Button>
            </Modal.Footer>
          </>
        )}
        {isLoading && (
          <Modal.Body>
            <LoadingPanel />
          </Modal.Body>
        )}
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
            {submitError && (
              <Alert size="small" variant="error">
                {submitError}
              </Alert>
            )}
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
              fromDate={dayjs().toDate()}
              toDate={dayjs().add(2, 'week').toDate()}
            />
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label="Begrunnelse"
              validate={[required]}
              description="Begrunnelsen er kun synlig i historikken, og vil ikke sendes til deltaker."
            />
          </VStack>
          <BoxNew marginBlock="space-16 0">
            <Alert size="small" variant="info">
              Behandlingen blir satt på vent til ny frist utløper.
            </Alert>
          </BoxNew>
        </Modal.Body>
        <Modal.Footer>
          <Button size="small" type="submit">
            Utsett frist
          </Button>
          <Button size="small" variant="secondary" type="button" onClick={lukkModal}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </RhfForm>
  );
};
