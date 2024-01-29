import React from 'react';
import { Button, Modal } from '@navikt/ds-react';
import styles from './confirmationModal.module.css';

interface ConfirmationModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  isSubmitting: boolean;
}

const ConfirmationModal = ({
  children,
  onConfirm,
  onCancel,
  isOpen,
  isSubmitting,
}: ConfirmationModalProps): JSX.Element =>
  isOpen ? (
    <Modal open={isOpen} onClose={onCancel} className={styles.confirmationModal}>
      <Modal.Body>
        {children}
        <div className={styles.confirmationModal__buttonSection}>
          <Button
            onClick={onConfirm}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="small"
            data-testid="modal-confirm-button"
          >
            Bekreft
          </Button>
          <Button
            onClick={onCancel}
            size="small"
            style={{ marginLeft: '0.5rem' }}
            disabled={isSubmitting}
            variant="tertiary"
          >
            Avbryt
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  ) : null;

export default ConfirmationModal;
