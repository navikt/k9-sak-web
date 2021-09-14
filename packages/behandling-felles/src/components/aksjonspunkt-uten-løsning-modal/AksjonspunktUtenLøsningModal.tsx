import React from 'react';
import Modal from 'nav-frontend-modal';
import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import styles from './aksjonspunktUtenLøsningModal.less';

Modal.setAppElement('#app');

interface AksjonspunktUtenLøsningModalProps {
  melding: string;
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
