import { Modal } from '@navikt/ds-react';
import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
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
          <Alertstripe type="advarsel">{melding}</Alertstripe>
          <Hovedknapp
            className={styles.aksjonspunktUtenLøsningModal__knapp}
            onClick={() => setIsOpen(false)}
            mini
            htmlType="button"
          >
            Lukk melding
          </Hovedknapp>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AksjonspunktUtenLøsningModal;
