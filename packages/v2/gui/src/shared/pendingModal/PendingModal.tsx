import { HGrid, Label, Loader, Modal } from '@navikt/ds-react';
import { useEffect, useState, type FC } from 'react';
import styles from './pendingModal.module.css';

const doNothing = () => undefined;

/** Vent to sekunder før modalen vises, slik at den ikke blinker ved raske kall. */
const MESSAGE_DELAY_MS = 2000;

interface PendingModalProps {
  /** Melding som vises i modalen. Vises kun dersom den finnes. */
  melding?: string;
}

/**
 * PendingModal
 *
 * Modal som vises når backend bruker lang tid på å prosessere.
 * Har en innebygd forsinkelse på to sekunder slik at den ikke
 * blinker frem og tilbake ved raske kall.
 */
const PendingModal: FC<PendingModalProps> = ({ melding }) => {
  const [synlig, setSynlig] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSynlig(true), MESSAGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!synlig) {
    return null;
  }

  return (
    <Modal className={styles['modal']} open aria-label="Venter på behandling" onClose={doNothing}>
      <Modal.Body>
        <HGrid gap="space-4" columns={{ xs: '2fr 10fr' }}>
          <div className="relative">
            <Loader variant="neutral" size="xlarge" title="Venter..." />
            <div className={styles['divider']} />
          </div>
          <div>
            <Label size="small" as="p" className={styles['modalText']}>
              {melding ?? 'Løsningen jobber med behandlingen...'}
            </Label>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default PendingModal;
