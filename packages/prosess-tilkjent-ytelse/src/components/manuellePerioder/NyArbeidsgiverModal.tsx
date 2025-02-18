import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidOrgNumber, required } from '@fpsak-frontend/utils';
import { Button, Modal } from '@navikt/ds-react';
import { InputField } from '@navikt/ft-form-hooks';
import { useFormContext } from 'react-hook-form';
import { NyArbeidsgiverFormState, TilkjentYtelseFormState } from './FormState';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  closeEvent: (values: NyArbeidsgiverFormState) => void;
  cancelEvent: () => void;
}

const NyArbeidsgiverModal = ({ showModal = false, closeEvent, cancelEvent }: OwnProps) => {
  const formMethods = useFormContext<TilkjentYtelseFormState>();
  const nyArbeidsgiverFormState = formMethods.watch('nyArbeidsgiverForm');

  const handleSubmit = async () => {
    const valid = await formMethods.trigger('nyArbeidsgiverForm');
    if (valid) {
      closeEvent(nyArbeidsgiverFormState);
    }
  };

  return (
    <Modal className={styles.modal} open={showModal} aria-label="Ny arbeidsgiver" onClose={cancelEvent}>
      <Modal.Body>
        <FlexContainer wrap>
          <FlexRow>
            <FlexColumn className={styles.fullWidth}>
              <InputField label="Navn" name="nyArbeidsgiverForm.navn" validate={[required]} format={value => value} />
              <InputField
                label="Organisasjonsnummer"
                name="nyArbeidsgiverForm.orgNr"
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
                onClick={handleSubmit}
                type="button"
              >
                Ok
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  cancelEvent();
                }}
                type="button"
              >
                Avbryt
              </Button>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Modal.Body>
    </Modal>
  );
};

export default NyArbeidsgiverModal;
