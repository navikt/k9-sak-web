import { Alert, Button, Modal } from '@navikt/ds-react';
import React from 'react';
import styles from './aksjonspunktUtenLøsningModal.module.css';

interface AksjonspunktUtenLøsningModalProps {
  melding: string | React.ReactNode;
}

const AksjonspunktUtenLøsningModal = ({ melding }: AksjonspunktUtenLøsningModalProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal open={isOpen} aria-label="Aksjonspunkt kan ikke løses" onClose={() => setIsOpen(false)}>
      <Modal.Body>
        <div className={styles.aksjonspunktUtenLøsningModal}>
          <Alert size="small" variant="warning">
            {melding}
          </Alert>
          <Button
            variant="primary"
            className={styles.aksjonspunktUtenLøsningModal__knapp}
            onClick={() => setIsOpen(false)}
            size="small"
          >
            Lukk melding
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AksjonspunktUtenLøsningModal;
