import { Alert, BodyShort, Button, Modal } from '@navikt/ds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './sakGårIkkeTilBeslutterModal.less';

const SakGårIkkeTilBeslutterModal = ({ onClose, onSubmit }) => {
  const intl = useIntl();
  return (
    <Modal open aria-label={intl.formatMessage({ id: 'SakGårIkkeTilBeslutterModal.ModalAriaLabel' })} onClose={onClose}>
      <Modal.Body className={styles.modalContent}>
        <Alert variant="warning" size="medium" inline>
          <div className={styles.textContainer}>
            <BodyShort>{intl.formatMessage({ id: 'SakGårIkkeTilBeslutterModal.IngenToTrinnskontroll' })}</BodyShort>
            <BodyShort>{intl.formatMessage({ id: 'SakGårIkkeTilBeslutterModal.BrevBlirIkkeSendt' })}</BodyShort>
          </div>
        </Alert>
        <div className={styles.buttonContainer}>
          <Button className={styles.submitButton} variant="primary" onClick={onSubmit} size="small" type="button">
            {intl.formatMessage({ id: 'SakGårIkkeTilBeslutterModal.FattVedtak' })}
          </Button>
          <Button variant="secondary" onClick={onClose} size="small" type="button">
            {intl.formatMessage({ id: 'SakGårIkkeTilBeslutterModal.Avbryt' })}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default SakGårIkkeTilBeslutterModal;
