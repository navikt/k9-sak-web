import { BodyShort, Button, HStack, Modal } from '@navikt/ds-react';
import styles from './okAvbrytModal.module.css';

interface OwnProps {
  headerText?: string;
  okButtonText?: string;
  showModal: boolean;
  submit: () => void;
  cancel: () => void;
}

/**
 * OkAvbrytModal
 *
 * Presentasjonskomponent. Modal som viser en valgfri tekst i tillegg til knappene OK og Avbryt.
 */
const OkAvbrytModal = ({ headerText, okButtonText = 'OK', showModal, cancel, submit }: OwnProps) => (
  <Modal className={styles.modal} open={showModal} aria-label={headerText || 'Bekreft eller avbryt'} onClose={cancel}>
    {headerText && (
      <Modal.Header>
        <BodyShort size="small">{headerText}</BodyShort>
      </Modal.Header>
    )}
    <Modal.Body>
      <HStack gap="2">
        <Button variant="primary" size="small" type="submit" onClick={submit} autoFocus>
          {okButtonText}
        </Button>
        <Button variant="secondary" size="small" type="reset" onClick={cancel}>
          Avbryt
        </Button>
      </HStack>
    </Modal.Body>
  </Modal>
);

export default OkAvbrytModal;
