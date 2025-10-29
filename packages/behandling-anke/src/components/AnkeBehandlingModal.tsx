import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import styles from './ankeBehandlingModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
  erFerdigbehandlet: boolean;
}

/**
 * AnkeVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en ankevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const AnkeVurderingModal = ({
  visModal = false,
  lukkModal,
  erFerdigbehandlet,
  intl,
}: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={visModal}
    aria-label={intl.formatMessage({ id: 'AnkeVurderingModal.ModalDescription' })}
    onClose={lukkModal}
  >
    <Modal.Body>
      <HGrid gap="space-16" columns={{ xs: '1fr 9fr 2fr' }}>
        <div className="relative">
          <Image className={styles.image} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </div>
        <div>
          <BodyShort size="small">
            {erFerdigbehandlet ? 'Behandlingen er ferdigbehandlet' : 'Vedtaket er oversendt'}
          </BodyShort>
          <BodyShort size="small">
            Du kommer nå til forsiden.
          </BodyShort>
        </div>
        <div>
          <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
            {intl.formatMessage({ id: 'AnkeVurderingModal.Ok' })}
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default injectIntl(AnkeVurderingModal);
