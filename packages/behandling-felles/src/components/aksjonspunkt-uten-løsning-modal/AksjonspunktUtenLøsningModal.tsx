import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import React from 'react';
import styles from './aksjonspunktUtenLøsningModal.css';

interface AksjonspunktUtenLøsningModalProps {
  melding: string | React.ReactNode;
}

const AksjonspunktUtenLøsningModal = ({ melding }: AksjonspunktUtenLøsningModalProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Aksjonspunkt kan ikke løses"
      onRequestClose={() => setIsOpen(false)}
      closeButton={false}
    >
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
    </Modal>
  );
};

export default AksjonspunktUtenLøsningModal;
