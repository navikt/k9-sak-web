import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './fatterVedtakStatusModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  tekstkode: string;
}

/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
const FatterVedtakStatusModal = ({
  intl,
  visModal = false,
  lukkModal,
  tekstkode,
}: OwnProps & WrappedComponentProps) => {
  const modalLabel = intl.messages[tekstkode] ? intl.formatMessage({ id: tekstkode }) : tekstkode;
  return (
    <Modal className={styles.modal} open={visModal} aria-label={modalLabel} onClose={lukkModal}>
      <Modal.Body>
        <HGrid gap="space-16" columns={{ xs: '1fr 9fr 2fr' }}>
          <div className="relative">
            <Image className={styles.image} alt={modalLabel} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </div>
          <div>
            <BodyShort size="small">{modalLabel}</BodyShort>
            <BodyShort size="small">
              <FormattedMessage id="FatterVedtakStatusModal.GoToSearchPage" />
            </BodyShort>
          </div>
          <div>
            <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
              {intl.formatMessage({ id: 'FatterVedtakStatusModal.Ok' })}
            </Button>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default injectIntl(FatterVedtakStatusModal);
