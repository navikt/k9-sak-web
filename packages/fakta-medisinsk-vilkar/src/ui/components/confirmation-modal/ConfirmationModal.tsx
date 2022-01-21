import React from 'react';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import styles from './confirmationModal.less';

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
}: ConfirmationModalProps): JSX.Element => (
    <Modal isOpen={isOpen} onRequestClose={onCancel} contentLabel="" className={styles.confirmationModal}>
        {children}
        <div className={styles.confirmationModal__buttonSection}>
            <Knapp
                onClick={onConfirm}
                spinner={isSubmitting}
                disabled={isSubmitting}
                type="hoved"
                htmlType="button"
                mini
            >
                Bekreft
            </Knapp>
            <Flatknapp
                onClick={onCancel}
                htmlType="button"
                mini
                style={{ marginLeft: '0.5rem' }}
                disabled={isSubmitting}
            >
                Avbryt
            </Flatknapp>
        </div>
    </Modal>
);

export default ConfirmationModal;
