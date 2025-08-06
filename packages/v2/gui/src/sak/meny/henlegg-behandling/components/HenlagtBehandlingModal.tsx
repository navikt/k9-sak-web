import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Label, Modal } from '@navikt/ds-react';
import styles from './henlagtBehandlingModal.module.css';

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

/**
 * HenlagtBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir saksbehandler tatt tilbake til sokesiden.
 */
const HenlagtBehandlingModal = ({ showModal, closeEvent }: OwnProps) => (
  <Modal
    className={styles.modal}
    open={showModal}
    aria-label="Behandlingen er henlagt"
    onClose={closeEvent}
    width="small"
  >
    <Modal.Body>
      <HGrid gap="space-4" columns={{ xs: '1fr 9fr 2fr' }}>
        <div className="relative">
          <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          <div className={styles.divider} />
        </div>
        <div>
          <Label size="small" as="p">
            Behandlingen er henlagt
          </Label>
          <BodyShort size="small">Du kommer nå til forsiden</BodyShort>
        </div>
        <div>
          <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} autoFocus>
            OK
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default HenlagtBehandlingModal;
