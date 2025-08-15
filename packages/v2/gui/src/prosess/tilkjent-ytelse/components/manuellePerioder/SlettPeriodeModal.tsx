import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Modal, VStack } from '@navikt/ds-react';
import styles from './periode.module.css';

interface OwnProps {
  showModal?: boolean;
  closeEvent: () => void;
  cancelEvent: () => void;
}

const SlettPeriodeModal = ({ showModal = false, closeEvent, cancelEvent }: OwnProps) => {
  return (
    <Modal className={styles['modal']} open={showModal} aria-label="Perioden slettes" onClose={cancelEvent}>
      <Modal.Body>
        <VStack gap="space-8">
          <HStack gap="space-16">
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            <BodyShort size="small" className={styles['modalLabel']}>
              Perioden vil bli slettet
            </BodyShort>
          </HStack>

          <div className={styles['right']}>
            <Button variant="primary" size="small" className={styles['button']} onClick={closeEvent} type="button">
              Ok
            </Button>
            <Button variant="secondary" size="small" onClick={cancelEvent} type="button">
              Avbryt
            </Button>
          </div>
        </VStack>
      </Modal.Body>
    </Modal>
  );
};

export default SlettPeriodeModal;
