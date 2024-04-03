import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './klageBehandlingModal.module.css';

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
    <Row className="">
      <Column xs="1">
        <Image className={styles.image} src={innvilgetImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="9">
        <BodyShort size="small">
          <FormattedMessage id="KlageVurderingModal.VedtakOversendt" />
        </BodyShort>
        <BodyShort size="small">
          <FormattedMessage id="KlageVurderingModal.GoToSearchPage" />
        </BodyShort>
      </Column>
      <Column xs="2">
        <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
          {intl.formatMessage({ id: 'KlageVurderingModal.Ok' })}
        </Button>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(KlageVurderingModal);
