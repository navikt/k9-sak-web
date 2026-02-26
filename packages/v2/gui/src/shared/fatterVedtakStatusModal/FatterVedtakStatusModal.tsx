import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import styles from './fatterVedtakStatusModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  tekst: string;
}

/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
export const FatterVedtakStatusModal = ({ visModal = false, lukkModal, tekst }: OwnProps) => (
  <Modal className={styles.modal} open={visModal} aria-label={tekst} onClose={lukkModal}>
    <Modal.Body>
      <HGrid gap="space-16" columns={{ xs: '1fr 9fr 2fr' }}>
        <div className="relative">
          <CheckmarkCircleFillIcon
            className={styles.image}
            title="Vedtak er fattet"
            fontSize="1.75rem"
            style={{ color: 'var(--ax-bg-success-strong)' }}
          />
          <div className={styles.divider} />
        </div>
        <div>
          <BodyShort size="small">{tekst}</BodyShort>
          <BodyShort size="small">Du kommer nå til forsiden.</BodyShort>
        </div>
        <div>
          <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
            OK
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);
