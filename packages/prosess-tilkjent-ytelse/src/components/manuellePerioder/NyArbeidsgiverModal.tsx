import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidOrgNumber, required } from '@fpsak-frontend/utils';
import { Button, Modal } from '@navikt/ds-react';
import { Form, InputField } from '@navikt/ft-form-hooks';
import { useForm } from 'react-hook-form';
import { NyArbeidsgiverFormState } from './FormState';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  closeEvent: (values: NyArbeidsgiverFormState) => void;
  cancelEvent: () => void;
}

export const NyArbeidsgiverModal = ({ showModal = false, closeEvent, cancelEvent }: OwnProps) => {
  const formMethods = useForm<NyArbeidsgiverFormState>({
    defaultValues: { navn: '', orgNr: '' },
  });

  const handleSubmit = (values: NyArbeidsgiverFormState) => {
    closeEvent(values);
  };

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Modal className={styles.modal} open={showModal} aria-label="Ny arbeidsgiver" onClose={cancelEvent}>
        <Modal.Body>
          <FlexContainer wrap>
            <FlexRow>
              <FlexColumn className={styles.fullWidth}>
                <InputField label="Navn" name="navn" validate={[required]} format={value => value} />

                <InputField
                  label="Organisasjonsnummer"
                  name="orgNr"
                  validate={[required, hasValidOrgNumber]}
                  format={value => value}
                />
              </FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn className={styles.right}>
                <VerticalSpacer eightPx />
                <Button
                  variant="primary"
                  size="small"
                  className={styles.button}
                  disabled={!formMethods.formState.isDirty}
                >
                  Ok
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    cancelEvent();
                  }}
                >
                  Avbryt
                </Button>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Modal.Body>
      </Modal>
    </Form>
  );
};

export default NyArbeidsgiverModal;
