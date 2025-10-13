import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './klageVurderingModal.module.css';

interface OwnProps {
  visModal?: boolean;
  lukkModal: () => void;
}

/**
 * KlageVurderingModal
 *
 * Presentasjonskomponent. Denne komponenten vises ved en klagevurdering hvor saksbehandler
 * i aksjonspunkt '' velger at ytelsesvedtaket skal stadfestes. Ved å trykke på knapp blir saksbehandler
 * tatt tilbake til sokesiden.
 */
const KlageVurderingModal = ({ visModal = false, lukkModal, intl }: OwnProps & WrappedComponentProps) => (
  <Modal
    className={styles.modal}
    open={visModal}
    aria-label={intl.formatMessage({ id: 'KlageVurderingModal.ModalDescription' })}
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
            <FormattedMessage id="KlageVurderingModal.VedtakOversendt" />
          </BodyShort>
          <BodyShort size="small">
            <FormattedMessage id="KlageVurderingModal.GoToSearchPage" />
          </BodyShort>
        </div>
        <div>
          <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
            {intl.formatMessage({ id: 'KlageVurderingModal.Ok' })}
          </Button>
        </div>
      </HGrid>
    </Modal.Body>
  </Modal>
);

export default injectIntl(KlageVurderingModal);
