import { Alert, BodyShort, Button, Modal } from '@navikt/ds-react';
import React from 'react';
import styles from './sakGårIkkeTilBeslutterModal.module.css';

const SakGårIkkeTilBeslutterModal = ({ onClose, onSubmit }) => {

  return (
    <Modal open aria-label={"Modal, sak går ikke til beslutter"} onClose={onClose}>
      <Modal.Body className={styles.modalContent}>
        <Alert variant="warning" size="medium" inline>
          <div className={styles.textContainer}>
            <BodyShort>{"Denne behandlingen har ikke totrinnskontroll."}</BodyShort>
            <BodyShort>{"Eventuelt brev blir sendt direkte til søker."}</BodyShort>
          </div>
        </Alert>
        <div className={styles.buttonContainer}>
          <Button className={styles.submitButton} variant="primary" onClick={onSubmit} size="small" type="button">
            {"Fatt vedtak"}
          </Button>
          <Button variant="secondary" onClick={onClose} size="small" type="button">
            {"Avbryt"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default SakGårIkkeTilBeslutterModal;
